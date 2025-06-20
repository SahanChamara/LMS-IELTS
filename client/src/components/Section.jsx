const Section = ({ title, children }) => (
  <section className="w-full h-full my-6 px-4">
    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
      {title}
    </h3>
    <div className="space-y-6">
      {children}
    </div>
  </section>
);

export default Section;
