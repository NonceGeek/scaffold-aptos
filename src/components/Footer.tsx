/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div className="text-center">
              <a href="https://github.com/noncegeek/scaffold-aptos" target="_blank" rel="noreferrer" className="link">
                ✰ Star me
              </a>
            </div>
            <div className="text-center">
              <a
                href="https://github.com/noncegeek/scaffold-aptos/issues"
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                🤔 Any Suggestions
              </a>
            </div>
            <span>·</span>
            {/* <div className="flex justify-center items-center gap-2">
              <p className="m-0 text-center">
                Built with <HeartIcon className="inline-block h-4 w-4" /> at
              </p>
              <a
                className="flex justify-center items-center gap-1"
                href="https://buidlguidl.com/"
                target="_blank"
                rel="noreferrer"
              >
                <BuidlGuidlLogo className="w-3 h-5 pb-1" />
                <span className="link">BuidlGuidl</span>
              </a>
            </div> */}
            <span>·</span>
            <div className="text-center">
              <a href="https://t.me/rootmud" target="_blank" rel="noreferrer" className="link">
                Support
              </a>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
