import { useEffect, useState } from "react";
import { NextPage } from "next";
// import { type } from "os";
import ReactMarkdown from "react-markdown";

//定义一个新的数据类型来记录后端返回的数据
export type resultByDataset = {
  dataset_id: string;
  results: search_result[];
};
//定义一个数据类型来记录每个搜索结果
export type search_result = {
  id: string;
  data: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  metadata: {};
};


const ETHSpace: NextPage = () => {
  //在对后端发起请求后，将response的内容保存在results中
  //如果用户选择使用mixed模式，则使用resultByDataset来记录结果
  const [projects, setProjects] = useState([]);
  const [filtedProjects, setFiltedProjects] = useState([]);
  //从后端获取数据集列表
  // useEffect(() => {
  //   fetchOptions();
  //   // console.log(data);
  // });
  // const fetchOptions = async () => {
  //   // const response = await fetch("https://faas.movespace.xyz/api/v1/run?name=VectorAPI&func_name=get_cluster", {
  //   //   method: "POST",
  //   //   headers:{
  //   //     'Content-Type':'application/json;charset=utf-8',
  //   //   },
  //   //   body:JSON.stringify({
  //   //     "params": ["ai-based-smart-contract-explorer"]
  //   //   })
  //   // });
  //   // const data=await response.json();
  // };
  //获取search prompt与dataset名字后向后端发request
  const init = async () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const tag = queryParameters.get("tag");
    const response = await fetch("https://scaffold-aptos.deno.dev/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // mode: "no-cors",
    });
    const data = await response.json();
    console.log("data:" + JSON.stringify(data));
    setProjects(data);
    setFiltedProjects(data);
    if (tag == "bodhi") {
      const filtedProj = data.filter(elem => elem.if_bodhi == true);
      console.log(filtedProj);
      setFiltedProjects(filtedProj);
    }
    if (tag == "gpt") {
      const filtedProj = data.filter(elem => elem.if_gpt == true);
      console.log(filtedProj);
      setFiltedProjects(filtedProj);
    }
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <div className="grid lg:grid-cols-1 flex-grow">
      <div className="flex flex-col justify-center items-center bg-[url('/assets/gradient-bg.png')] bg-[length:100%_100%] py-10 px-5 sm:px-0 lg:py-auto max-w-[100vw] ">
      {/* <div className="hero min-h-screen bg-base-200 bg-gradient-to-r from-green-500 to-blue-500"> */}
        <div className="hero-content text-center">
          <div className="max-w-screen-xl">
            <h1 className="text-2xl font-bold">🏝️ Scaffold-Aptos Examples 🏝️</h1>
            <p className="py-6"> -- See the AwEsOMe Examples of scaffold-aptos!
            </p>
            <div className="join mb-6">
              <div className="grid gap-5 mt-5 md:grid-cols-1 lg:grid-cols-1">
                {filtedProjects.map(({ id, name, description, url, github, tags, author}) => (
                  <div
                    key={id}
                    className="w-[500px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                  >
                  {/* TODO: make width more */}
                    <div className="p-5">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 overflow-y-auto">
                        {description}
                      </p>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-32"
                      >
                        🚀Launch App
                      </a>
                      &nbsp;&nbsp;&nbsp;
                      <a
                        href={github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-32"
                      >
                        🌎Github
                      </a>
                      &nbsp;&nbsp;&nbsp;
                      <a
                        href={author.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-32"
                      >
                        👀Author
                      </a>
                      
                      <br></br>
                      <br></br>
                      <div>
                        <b>Tags: </b>
                        {tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 text-xs font-semibold leading-none text-white bg-orange-600 rounded-full">
                            {tag}
                          </span>
                        ))}
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ETHSpace;
