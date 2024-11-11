// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from '@payload/collections/Users'
import { Media } from '@payload/collections/Media'
import { Recipes } from '@payload/collections/recipes'
import { Prompts } from '@payload/collections/prompts'
import { s3Storage } from '@payloadcms/storage-s3'
import { getUnsplashImages } from '@payload/endpoints/get-unsplash-images'
import { setUnsplashImage } from '@payload/endpoints/set-unsplash-image'
import { generateRecipe } from '@payload/endpoints/generate-recipe'
import { Settings } from '@payload/globals/Settings'
import { Limits } from '@payload/collections/limits'
import { Likes } from '@payload/collections/likes'
import { unpublishRecipe } from '@payload/endpoints/unpublish-recipe'
import { publishRecipe } from '@payload/endpoints/publish-recipe'
import { likeRecipe } from '@payload/endpoints/like-recipe'
import { unlikeRecipe } from '@payload/endpoints/unlike-recipe'
import { hasLike } from '@payload/endpoints/has-like'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

console.log('import.meta.env.VITE_API_ENDPOINT', import.meta)

export default buildConfig({
  serverURL: process.env.SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,

    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Recipes, Prompts, Limits, Likes],
  globals: [Settings],
  editor: undefined,
  endpoints: [
    getUnsplashImages,
    setUnsplashImage,
    generateRecipe,
    unpublishRecipe,
    publishRecipe,
    likeRecipe,
    hasLike,
    unlikeRecipe,
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  graphQL: {
    disable: false,
  },
  cors: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.includes(',')
      ? process.env.CORS_ORIGINS.split(',')
      : [process.env.CORS_ORIGINS]
    : [''],
  csrf: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.includes(',')
      ? process.env.CORS_ORIGINS.split(',')
      : [process.env.CORS_ORIGINS]
    : [],
  plugins: [
    s3Storage({
      collections: {
        ['media']: true,
      },
      bucket: process.env.S3_BUCKET_NAME!,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS!,
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
      },
    }),
  ],
})
