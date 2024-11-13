export const Footer = () => {
  return (
    <footer class='container mt-6'>
      <div class='border-t border-border py-6 flex gap-8 flex-col lg:flex-row justify-between'>
        <div class='prose'>
          <p>
            © Replate 2024 | made with lots of ☕ by{' '}
            <a href='https://x.com/paulpopus' target='_blank'>
              paul
            </a>{' '}
            and{' '}
            <a href='https://x.com/shellsterstudio' target='_blank'>
              shelly
            </a>
          </p>
        </div>

        <nav aria-label='Footer navigation'>
          <ul class='flex gap-4 items-center'>
            <li>
              <a target='_blank' href='https://github.com/NouanceLabs/replate-app-open'>
                View code
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
