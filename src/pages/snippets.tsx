import ReactMarkdown from 'react-markdown';


export default function Home() {
  const markdown = `# SNIPPETS
  # Interact with Function

  \`\`\`
  async function mintHero() {
      await signAndSubmitTransaction(doMintHero(), { gas_unit_price: 100 }).then(() => {
        // updated it
        // setTimeout(get_services, 3000);
      });
    }
  
    function doMintHero() {
      // description: string;
      // gender: string;
      // name: string;
      // race: string;
      // uri: string;
      const { name, description, gender, race, uri } = mintHeroInput;
      return {
        type: 'entry_function_payload',
        function: DAPP_ADDRESS + '::hero::mint_hero',
        type_arguments: [],
        arguments: [description, gender, name, race, uri],
      };
    }
  
  \`\`\`
  
  ## Read NFT
  
  \`\`\`
  const loadHero = async (collection_name: string) => {
      
      if (account && account.address) {
          setLoading(true);
          const provider = new Provider({
            fullnodeUrl: "https://fullnode.testnet.aptoslabs.com/v1/",
            indexerUrl: "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql"
          });
          // mainnet: "https://indexer.mainnet.aptoslabs.com/v1/graphql",
          // testnet: "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql",
          // devnet: "https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql",
  
          const resourceAddress = await AptosAccount.getResourceAccountAddress(
            DAPP_ADDRESS,
            new TextEncoder().encode(STATE_SEED)
          );
          console.log("resourceAddr:", resourceAddress);
          const collectionAddress = await provider.getCollectionAddress(
            // account.address,
            resourceAddress, 
            "Hero Quest!"
          );
  
          console.log(collectionAddress);
          const tokens = await provider.getTokenOwnedFromCollectionAddress(
            account.address.toString(),
            "0xeec058a336375649ea3a718750f74d94475880bce6d06ec5e32c7ed5dbfbbc8e",
            {
              tokenStandard: "v2",
            }
          );
          const nfts = tokens.current_token_ownerships_v2.map((t) => {
            const token_data = t.current_token_data;
            const properties = token_data?.token_properties;
            console.log("token_data", token_data);
            console.log("properties", properties);
            return {
              name: token_data?.token_name || "",
              token_id: token_data?.token_data_id || "",
              token_uri: token_data?.token_uri || "",
              token_properties: properties
            };
          });
  
          setNFTs(nfts);
          console.log(tokens);
          setLoading(false);
      }
    };
  
    useEffect(() => {
      loadHero("Hero Quest!");
    }, [account]);
  \`\`\`
  
  ## Show NFT
  
  \`\`\`
            <div className="flex gap-4">
                {isLoading ? (
                  <LoaderIcon className="!w-8 !h-8" />
                ) : (
                  nfts.map(nft => (
                    <div className="bg-blue-300 w-24 h-24 flex flex-col gap-2 justify-center 
                    items-center cursor-pointer hover:bg-blue-300">
                      <span className="text-md">
                        {nft.name}
                      </span>
                      <p className="text-sm">
                        Uri:&nbsp;
                        <b>{nft.token_uri}</b>
                      </p>
                    </div>
                  ))
                )}
              </div>
  \`\`\`
  
  ## Read Resource
  
  See in:
  
  >[https://github.com/rootMUD/scaffold-aptos-examples/tree/movedid](https://github.com/rootMUD/scaffold-aptos-examples/tree/movedid)
  
  `;
  return (
    <div className="max-w-6xl mx-auto my-8 p-4 bg-white shadow-lg rounded-lg">
      <div className="markdown">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
