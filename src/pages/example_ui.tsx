// import { DAPP_NAME, DAPP_ADDRESS, APTOS_FAUCET_URL, APTOS_NODE_URL, MODULE_URL } from '../config/constants';
// import { useWallet } from '@manahippo/aptos-wallet-adapter';
// import { MoveResource } from '@martiandao/aptos-web3-bip44.js/dist/generated';
// import { useState, useEffect } from 'react';
// import React from 'react';
// import { AptosAccount, WalletClient, HexString } from '@martiandao/aptos-web3-bip44.js';
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [popContent, setPopContent] = useState("");
  const [showModal, setShowModal] = useState(false);

  function setMarkdownShowModal(state: boolean, text: string) {
    let payload = "";
    if (text === "container") {
      payload = `
\`\`\`typescript
<div
className="max-w-full flex items-center justify-center h-10 my-5 bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
>
    <p>max-w-full</p>
</div>
<div
className="max-w-2xl flex items-center justify-center h-10 my-5 bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
>
    <p>max-w-2xl</p>
</div>
<div
className="max-w-lg flex items-center justify-center h-10 my-5 bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
>
    <p>max-w-lg</p>
</div>
<div
className="max-w-sm flex items-center justify-center h-10 my-5 bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
>
    <p>max-w-sm</p>
</div>
\`\`\`
`;
    } else if (text === "btn-with-diff-size") {
      payload = `
\`\`\`typescript
{/* Small Button */}
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm">
    Small Button
</button>
&nbsp;
{/* Medium Button */}
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Medium Button
</button>
&nbsp;
{/* Large Button */}
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded text-lg">
    Large Button
</button>
\`\`\`
        `;
    } else if (text === "btn-with-diff-type") {
      payload = `
\`\`\`typescript
<div className="p-8 space-x-2 space-y-2">
{/* Primary Button */}
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Primary
</button>
{/* Secondary Button */}
<button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
  Secondary
</button>
...
{/* Light Button */}
<button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded">
  Light
</button>
{/* Dark Button */}
<button className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
  Dark
</button>
{/* Outline Button */}
<button className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded">
  Outline
</button>
</div>
\`\`\`
        `;
    } else if (text === "label") {
      payload = `
\`\`\`typescript
{/* Blue Badge */}
<span className="bg-blue-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
Blue Badge
</span>
                ……
{/* Orange Outlined Badge */}
<span className="border border-orange-500 text-orange-500 text-xs font-semibold px-2.5 py-0.5 rounded">
Orange Badge
</span>
\`\`\`
        `;
    } else if (text === "markdown") {
      payload = `
\`\`\`typescript
async function fetchMarkdown(text: string) {
    try {
        const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .process(text);

        setContent(file.toString());
    } catch (error) {
        console.error("Error processing markdown:", error);
        // Handle the error state appropriately
}
}

useEffect(() => {
fetchMarkdown(
    "# Hello, world❤️!\n\n Author: [https://x.com/0xleeduckgo](https://x.com/0xleeduckgo)"
);
}, []); // Empty dependency array means this effect runs once on mount
...
<article className="prose lg:prose-xl max-w-4xl mx-auto my-8 p-4 bg-white shadow-lg rounded-lg">
    <div dangerouslySetInnerHTML={{ __html: content }} />
</article>
\`\`\`
        `;
    }
    fetchMarkdown2(payload);
    setShowModal(state);
  }

  async function fetchMarkdown2(text: string) {
    // TODO: optimize
    try {
      const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .process(text);

      setPopContent(file.toString());
    } catch (error) {
      console.error("Error processing markdown:", error);
      // Handle the error state appropriately
    }
  }

  async function fetchMarkdown(text: string) {
    try {
      const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .process(text);

      setContent(file.toString());
    } catch (error) {
      console.error("Error processing markdown:", error);
      // Handle the error state appropriately
    }
  }

  useEffect(() => {
    fetchMarkdown(
      "# Hello, world❤️!\n\n Author: [https://x.com/0xleeduckgo](https://x.com/0xleeduckgo)"
    );
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="max-w-6xl mx-auto my-8 p-4 bg-white shadow-lg rounded-lg">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="prose bg-white p-5 rounded-lg shadow-lg text-gray-800  w-full">
            {/* Close Button */}
            <button
              className="text-red-500 float-right"
              onClick={() => setMarkdownShowModal(false, "")}
            >
              Close
            </button>
            <br />
            <br />
            {/* Markdown Content */}
            <div dangerouslySetInnerHTML={{ __html: popContent }} />
          </div>
        </div>
      )}
      <center>
        <div className="markdown">
          <h2>
            {" "}
            Containers (
            <a
              onClick={() => setMarkdownShowModal(true, "container")}
              className="cursor-pointer text-gray-700 dark:text-gray-400 hover:text-gray-900 hover:underline"
            >
              {" "}
              𓁏{" "}
            </a>
            )
          </h2>
        </div>
        <div className="max-w-full flex items-center justify-center h-10 my-5 bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
          <p>max-w-full</p>
        </div>
        <div className="max-w-2xl flex items-center justify-center h-10 my-5 bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
          <p>max-w-2xl</p>
        </div>
        <div className="max-w-lg flex items-center justify-center h-10 my-5 bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
          <p>max-w-lg</p>
        </div>
        <div className="max-w-sm flex items-center justify-center h-10 my-5 bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
          <p>max-w-sm</p>
        </div>
        <div className="markdown">
          <h2> Link </h2>
        </div>
        <a
          href="https://x.com/0xleeduckgo"
          className="text-gray-700 dark:text-gray-400 hover:text-gray-900 hover:underline"
        >
          {" "}
          Link{" "}
        </a>
        <div className="markdown">
          <h2> Buttons</h2>
        </div>
        <div className="markdown">
          <p>
            {" "}
            Buttons with different Size(
            <a
              onClick={() => setMarkdownShowModal(true, "btn-with-diff-size")}
              className="cursor-pointer text-gray-700 dark:text-gray-400 hover:text-gray-900 hover:underline"
            >
              {" "}
              𓁏{" "}
            </a>
            ):
          </p>
        </div>
        {/* Small Button */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm">
          Small Button
        </button>
        &nbsp;
        {/* Medium Button */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Medium Button
        </button>
        &nbsp;
        {/* Large Button */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded text-lg">
          Large Button
        </button>
        <div className="markdown">
          <p>
            {" "}
            Buttons with different Type(
            <a
              onClick={() => setMarkdownShowModal(true, "btn-with-diff-type")}
              className="cursor-pointer text-gray-700 dark:text-gray-400 hover:text-gray-900 hover:underline"
            >
              {" "}
              𓁏{" "}
            </a>
            ):
          </p>
        </div>
        <div className="p-8 space-x-2 space-y-2">
          {/* Primary Button */}
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Primary
          </button>

          {/* Secondary Button */}
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Secondary
          </button>

          {/* Success Button */}
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Success
          </button>

          {/* Danger Button */}
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Danger
          </button>

          {/* Warning Button */}
          <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
            Warning
          </button>

          {/* Info Button */}
          <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
            Info
          </button>

          {/* Light Button */}
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded">
            Light
          </button>

          {/* Dark Button */}
          <button className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
            Dark
          </button>

          {/* Outline Button */}
          <button className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded">
            Outline
          </button>
        </div>
        <div className="markdown">
          <h2>
            {" "}
            Label (
            <a
              onClick={() => setMarkdownShowModal(true, "label")}
              className="cursor-pointer text-gray-700 dark:text-gray-400 hover:text-gray-900 hover:underline"
            >
              {" "}
              𓁏{" "}
            </a>
            )
          </h2>
        </div>
        <div className="p-8 space-x-2 space-y-2">
          {/* Blue Badge */}
          <span className="bg-blue-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
            Blue Badge
          </span>

          {/* Red Badge */}
          <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
            Red Badge
          </span>

          {/* Green Badge */}
          <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
            Green Badge
          </span>

          {/* Yellow Badge */}
          <span className="bg-yellow-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
            Yellow Badge
          </span>

          {/* Purple Badge */}
          <span className="bg-purple-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
            Purple Badge
          </span>

          {/* Pink Badge */}
          <span className="bg-pink-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
            Pink Badge
          </span>

          {/* Indigo Badge */}
          <span className="bg-indigo-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
            Indigo Badge
          </span>

          {/* Teal Badge */}
          <span className="bg-teal-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
            Teal Badge
          </span>

          {/* Orange Badge */}
          <span className="bg-orange-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
            Orange Badge
          </span>
          <br></br>
          <br></br>

          {/* Blue Outlined Badge */}
          <span className="border border-blue-500 text-blue-500 text-xs font-semibold px-2.5 py-0.5 rounded">
            Blue Badge
          </span>

          {/* Red Outlined Badge */}
          <span className="border border-red-500 text-red-500 text-xs font-semibold px-2.5 py-0.5 rounded">
            Red Badge
          </span>

          {/* Green Outlined Badge */}
          <span className="border border-green-500 text-green-500 text-xs font-semibold px-2.5 py-0.5 rounded">
            Green Badge
          </span>

          {/* Yellow Outlined Badge */}
          <span className="border border-yellow-500 text-yellow-500 text-xs font-semibold px-2.5 py-0.5 rounded">
            Yellow Badge
          </span>

          {/* Purple Outlined Badge */}
          <span className="border border-purple-500 text-purple-500 text-xs font-semibold px-2.5 py-0.5 rounded">
            Purple Badge
          </span>

          {/* Pink Outlined Badge */}
          <span className="border border-pink-500 text-pink-500 text-xs font-semibold px-2.5 py-0.5 rounded">
            Pink Badge
          </span>

          {/* Indigo Outlined Badge */}
          <span className="border border-indigo-500 text-indigo-500 text-xs font-semibold px-2.5 py-0.5 rounded">
            Indigo Badge
          </span>

          {/* Teal Outlined Badge */}
          <span className="border border-teal-500 text-teal-500 text-xs font-semibold px-2.5 py-0.5 rounded">
            Teal Badge
          </span>

          {/* Orange Outlined Badge */}
          <span className="border border-orange-500 text-orange-500 text-xs font-semibold px-2.5 py-0.5 rounded">
            Orange Badge
          </span>
        </div>
        <div className="markdown">
          <h2>
            {" "}
            Render Markdown (
            <a
              onClick={() => setMarkdownShowModal(true, "markdown")}
              className="cursor-pointer text-gray-700 dark:text-gray-400 hover:text-gray-900 hover:underline"
            >
              {" "}
              𓁏{" "}
            </a>
            )
          </h2>
        </div>
        {/* Render the processed content */}
        <article className="prose lg:prose-xl max-w-4xl mx-auto my-8 p-4 bg-white shadow-lg rounded-lg">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>
        <div className="markdown">
          <p>TBD: </p>
          <h2> Modal </h2>
          <h2> Input </h2>
          <h2> Select </h2>
          <h2> Switch </h2>
          <h2> Dropdown </h2>
          <h2> Tabs </h2>
          <h2> Cards </h2>
          <h2> Table </h2>
        </div>
      </center>
    </div>
  );
}
