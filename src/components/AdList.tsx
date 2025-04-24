const AdList = ({ ads }) => {
  if (!ads || ads.length === 0) {
    return null;
  }

  return (
    <ul className="list-none py-4 m-0 w-full">
      {ads.map(({ id, title, url }) => {
        return (
          <li key={id}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="relative bg-[#eaa31e] text-black border border-black rounded-lg py-[15px] px-[20px] mb-[10px] flex justify-between items-center cursor-pointer transition-colors duration-300 font-bold overflow-hidden text-[17px] hover:bg-[#c47f00]
          before:content-[''] before:absolute before:top-[-150%] before:left-[-150%] before:w-full before:h-[50%] before:bg-[rgba(255,255,255,0.3)] before:-rotate-45 before:animate-myshine font-inter"
            >
              <span className="underline">{title}</span>
              <span>➤</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default AdList;
