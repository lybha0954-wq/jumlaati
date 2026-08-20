import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function processTask(taskDescription: string, contextData: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    أنت خبير برمجة وتطوير منصات تجارية.
    المهمة المطلوبة: ${taskDescription}
    البيانات المتاحة للعمل عليها: ${JSON.stringify(contextData)}
    قم بإعطاء الحل البرمجي أو التحليل المطلوب بدقة واحترافية.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

