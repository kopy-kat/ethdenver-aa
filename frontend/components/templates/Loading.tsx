import Image from "next/image";
import { Layout } from "./Layout";

export function LoadingScreen() {
  return (
    <Layout>
      <section className="flex justify-center items-center h-[70vh]">
        <div className="loading-pulse rounded-full p-4 flex justify-center items-center">
        </div>
      </section>
    </Layout>
  );
}
