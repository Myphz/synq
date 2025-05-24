import { createClient } from "@supabase/supabase-js";
import type { Database } from "$lib/types/supabase";
import { SUPABASE_KEY, SUPABASE_URL } from "../../constants";
import { page } from "$app/state";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

export const getJWT = () =>
  page.url.searchParams.get("user") == "2"
    ? {
        jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyNzQ4MDY5NDA5LCJpYXQiOjE3NDgwNjk0MTAsImlzcyI6Imh0dHBzOi8vZWljZG96Zml3bm90bWdzZXd3bWouc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjRhNzFiYjg4LThkMzctNGIzMy05MjMxLTQyMzNhZWQzZTlhYiIsImVtYWlsIjoibWFyaW9AbWFyaW8uY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzQ4MDY5NDEwfV19.X26nA7iYLXas6ROY0gmbhDnUDM1ck2i3CsshCnT6Pjs",
        id: "4a71bb88-8d37-4b33-9231-4233aed3e9ab"
      }
    : {
        jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyNzQ4MDc4NzI0LCJpYXQiOjE3NDgwNzg3MjUsImlzcyI6Imh0dHBzOi8vZWljZG96Zml3bm90bWdzZXd3bWouc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjY1MTZhY2JlLTM5ZWMtNGU0Ny1iZjQyLTdiM2I5MzliMjA2NyIsImVtYWlsIjoic3RlZmFub0BzdGVmYW5vLm9rIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzQ4MDc4NzI1fV19.JnjO4q2yjEekZrBkdnGZy_RaREQvmyD78QpJ-sK5oT0",
        id: "6516acbe-39ec-4e47-bf42-7b3b939b2067"
      };
