const HorizontalAdBanner = ({ image, url }) => {
  return (
    <section className="bg-slate-50 p-4 dark:bg-gray-900">
      <div className="container">
        <a href={url} target="_blank" rel="noreferrer">
          <img
            src={`http://localhost:1337${image}`}
            alt="advertisement"
            className="w-full max-h-36 border-gray-400 border-[1px] object-cover"
          />
        </a>
      </div>
    </section>
  );
};

export default HorizontalAdBanner;
