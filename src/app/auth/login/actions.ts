// "use client";

// import { createClient } from "@/utils/supabase/client";

// export async function signInGithub() {
//   const supabase = createClient();
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: "github",
//     options: {
//       redirectTo: "http://localhost:3000/auth/callback",
//     },
//   });
//   console.log("TANGINA MO LOGIN NA KO");
//   console.log(data, error);
// }
// export async function signInGoogle() {
//   const supabase = createClient();
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: {
//       redirectTo: "http://localhost:3000/auth/callback",
//     },
//   });
//   console.log("TANGINA MO LOGIN NA KO GOOGLE");
//   console.log(data, error);
// }
// export async function signOut() {
//   console.log("TANGINA MO LOGOUT NA KO");
//   const supabase = createClient();
//   await supabase.auth.signOut();
//   const session = await supabase.auth.getSession();
//   console.log(session.data);
// }
