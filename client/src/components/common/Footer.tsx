const categories = [
  'space',
  'impressionism',
  'baroque',
  'renaissance',
  'contemporary',
  'cyberpunk',
  'photography',
  'anime',
];

export default function Footer() {
  return (
    <footer className="bg-purple-400 text-white">
      <div className="max-w-7xl mx-auto px-10 sm:px-14 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex justrify-center gap-2 items-center md:items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="purple"
              viewBox="0 0 50 50"
              className="h-8 w-8"
            >
              <path d="M47.819 32.652L33.02 6.535C32.133 4.972 30.466 4 28.669 4H20c-.357 0-.687.19-.865.499-.179.31-.18.69-.002.999l23 40C42.312 45.81 42.643 46 43 46c.01 0 .02 0 .029 0 .368-.011.7-.224.865-.553l4.047-8.094C48.688 35.861 48.642 34.104 47.819 32.652zM27.84 28.457l-11-17C16.655 11.172 16.339 11 16 11c-.007 0-.014 0-.021 0-.347.008-.665.194-.841.493l-10 17c-.182.309-.184.692-.006 1.003C5.31 29.808 5.642 30 6 30h21c.366 0 .703-.2.879-.522C28.054 29.156 28.039 28.765 27.84 28.457zM36.874 44.515l-5-9C31.698 35.197 31.363 35 31 35H3c-.354 0-.683.188-.862.493-.18.305-.184.683-.012.992l5 9C7.302 45.803 7.637 46 8 46h28c.354 0 .683-.188.862-.493C37.042 45.202 37.046 44.824 36.874 44.515z"></path>
            </svg>
            <h2 className="text-xl font-bold">AI JPG Image Store</h2>
          </div>
          <nav className="col-span-2">
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <li>
                <a href="/" className="hover:text-gray-300 transition-colors">
                  Home
                </a>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <a
                    href={`/images/${category.toLowerCase()}`}
                    className="hover:text-gray-300 transition-colors"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AI JPG Image Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
