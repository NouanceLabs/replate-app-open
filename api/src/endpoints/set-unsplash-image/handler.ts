import { PayloadHandler } from 'payload'
import { fileTypeFromBuffer } from 'file-type'
import { headersWithCors } from '@payloadcms/next/utilities'
import * as qs from 'qs-esm'

const UNSPLASH_API_URL = 'https://api.unsplash.com'
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

export const setUnsplashImageHandler: PayloadHandler = async (req) => {
  const { payload, user } = req

  const headers = headersWithCors({
    headers: new Headers(),
    req,
  })

  if (!UNSPLASH_ACCESS_KEY) {
    payload.logger.error('UNSPLASH_ACCESS_KEY is not set')
    return new Response('Internal Server Error', { status: 500, headers })
  }

  if (!user) {
    return new Response('Unauthorized', { status: 401, headers })
  }

  const body = req.json ? await req.json() : null

  const recipeID = body?.recipeID
  const imageID = body?.imageID

  if (!recipeID || !imageID) {
    return new Response('Bad Request', { status: 400, headers })
  }

  const recipe = await payload.findByID({
    collection: 'recipes',
    id: recipeID,
    depth: 0,
  })

  if (!recipe || recipe.owner !== user.id) {
    return new Response('Not found', { status: 404, headers })
  }

  async function getFileExtensionFromData(data: Buffer): Promise<string | undefined> {
    const fileType = await fileTypeFromBuffer(data)
    return fileType?.ext // Returns the extension if detected
  }

  try {
    const queryObject = {
      id: imageID,
      client_id: UNSPLASH_ACCESS_KEY,
    }

    const query = qs.stringify(queryObject)

    const response = await fetch(`${UNSPLASH_API_URL}/photos/${imageID}?${query}`, {
      method: 'get',
    })
    const imageData = await response.json()

    if (!response.ok || !imageData || !imageData.links) {
      payload.logger.error('Failed to fetch image from Unsplash', { response })
      return new Response('Internal Server Error', { status: 500, headers })
    }

    const downloadLocation = imageData.links.download_location
    const downloadLocationResponse = await fetch(
      `${downloadLocation}?${qs.stringify({ client_id: UNSPLASH_ACCESS_KEY })}`,
      {
        method: 'get',
      },
    )

    const downloadLocationData = await downloadLocationResponse.json()
    const downloadURL = downloadLocationData?.url

    if (!downloadURL) {
      return new Response('Internal Server Error', { status: 500, headers })
    }

    const downloadResponse = await fetch(
      `${downloadURL}?${qs.stringify({ client_id: UNSPLASH_ACCESS_KEY })}`,
      {
        method: 'get',
      },
    )

    // Create a new File object from the Blob data
    const arrayBuffer = await downloadResponse.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Get the MIME type and content length
    const mimeType = downloadResponse.headers.get('content-type') || 'application/octet-stream'
    const size = parseInt(downloadResponse.headers.get('content-length') || '0', 10)

    const extension = await getFileExtensionFromData(buffer)
    const fileName = imageData.slug + '.' + extension

    // Construct the File object
    const file: File = {
      // @ts-expect-error
      data: buffer,
      mimetype: mimeType,
      name: fileName,
      size: size || buffer.length, // If content-length is not available, use buffer length
    }

    const attribution = `Photo by <a target="_blank" href="${imageData.user.links.html}?utm_source=replate&utm_medium=referral">@${imageData.user.username}</a> at <a target="_blank" href="${imageData.links.html}?utm_source=replate&utm_medium=referral">Unsplash</a>.`

    const createdMedia = await payload.create({
      collection: 'media',
      data: {
        alt: imageData.alt_description,
        blurhash: imageData.blur_hash,
        color: imageData.color,
        description: imageData.description,
        attribution,
      },
      // @ts-expect-error
      file: file,
    })

    await payload.update({
      collection: 'recipes',
      id: recipeID,
      data: {
        featuredImage: createdMedia.id,
      },
    })

    return new Response('Success!', { status: 200, headers })
  } catch (error) {
    payload.logger.error('Failed to fetch image from Unsplash', { error })
    return new Response('Internal Server Error', { status: 500, headers })
  }
}
