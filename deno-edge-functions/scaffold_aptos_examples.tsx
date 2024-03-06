import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

console.log("Hello from Query!")



const router = new Router();

router
  .get("/", async (context) => {

    const supabase = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      // { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    // 1. create a item in bodhi_user_search.
    const { data, error } = await supabase.
      from('scaffold-aptos-examples')
      .select();
    context.response.body = data
  })


const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());

console.info("CORS-enabled web server listening on port 8000");


// app.use(async (ctx) => {
//     if (!ctx.request.hasBody) {
//       ctx.throw(415);
//     }
//     const reqBody = await ctx.request.body().value;
//     console.log("a=", reqBody.a);
//     ctx.response.status = 200;
//   });

await app.listen({ port: 8000 });