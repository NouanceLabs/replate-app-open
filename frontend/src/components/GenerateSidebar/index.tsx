import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const GenerateSidebar = () => {
  return (
    <div class='border-b flex-grow-[2] flex-shrink-0 lg:pr-8 border-elements-border-primary lg:border-r lg:border-b-0 lg:pb-[5rem] lg:max-w-[22.25rem]'>
      <h1 class='heading-1 mb-6 lg:mb-12'>Generate Recipe</h1>
      <div class='hidden lg:block'>
        <div class='prose mb-12'>
          <p>
            <strong>How it works:</strong>
          </p>
          <p>
            Simply type in your ingredients, adjust the number of servings, the complexity and the amount of details and click the button to
            generate a recipe.
          </p>
          <p>Your ingredients will be saved in your account and displayed right here next time you generate a recipe.</p>
        </div>

        <div>
          <img height={1040} width={692} class='rounded-lg' src='/images/generate-sidebar-image.jpeg' loading='lazy' />
        </div>
      </div>

      <Accordion multiple={false} collapsible class='lg:hidden'>
        <AccordionItem value='item-1' class='border-none'>
          <AccordionTrigger>How it works:</AccordionTrigger>
          <AccordionContent>
            <div class='prose mb-12'>
              <p>
                Simply type in your ingredients, adjust the number of servings, the complexity and the amount of details and click the
                button to generate a recipe.
              </p>
              <p>Your ingredients will be saved in your account and displayed right here next time you generate a recipe.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
