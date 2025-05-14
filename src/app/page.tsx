// src/app/page.tsx
import fs from 'fs/promises'; // Node.js file system module
import path from 'path';      // Node.js path module
import { AIModel } from '@/types'; // Adjust path if needed
import ModelTable from '@/components/ModelTable'; // We'll create this next
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/Card';

async function getModelData(): Promise<AIModel[]> {
  // Construct the absolute path to the JSON file
  const filePath = path.join(process.cwd(), 'data', 'ai-models.json');
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const data: AIModel[] = JSON.parse(jsonData);
    return data;
  } catch (error) {
    console.error("Error reading or parsing AI model data:", error);
    // In a real app, you might want to return an empty array
    // or throw the error to be caught by an error boundary
    return [];
  }
}

export default async function HomePage() {
  const models = await getModelData();

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 max-w-4xl">
          <h1 className="text-3xl font-bold mb-2 text-white">
            AI Language Model Pricing
          </h1>
          <p className="text-slate-400">
            Compare pricing across various AI language models. Find the best option for your use case based on input/output costs and context window size.
          </p>
        </div>

        <div className="my-4">
          {models.length > 0 ? (
            <ModelTable initialModels={models} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-200">No data available</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Could not load model data. Please try again later.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <footer className="mt-16 text-center text-sm text-slate-400 border-t border-slate-700 pt-6 pb-16">
          <p>Data last updated: April 2025</p>
          <p className="mt-2">
            Built with <span className="text-red-500">♥</span> using Next.js and Tailwind CSS
          </p>
          <p>Made by miguelg19877</p>
          <p>Next update to include more providers like AzureAI Foundry and AWS Bedrock</p>
        </footer>
      </main>
    </>
  );
}

// Important: This page will be statically generated (SSG) by default
// because it fetches data without dynamic parameters or cookies/headers.
// Next.js will read the file *at build time*.