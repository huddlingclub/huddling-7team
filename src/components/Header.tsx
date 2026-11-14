export default function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="/" className="text-brand text-lg font-bold">
          Huddling 7team
        </a>
        <nav className="flex gap-6 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-900">
            Menu 1
          </a>
          <a href="#" className="hover:text-gray-900">
            Menu 2
          </a>
        </nav>
      </div>
    </header>
  )
}
