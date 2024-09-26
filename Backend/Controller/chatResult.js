import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const chatResult = async (query, file) => {
    try {
        const API_KEY = process.env.GEMINI_API_KEY

        const fileManager = new GoogleAIFileManager(process.env.API_KEY);
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let result;
        const prompt = query;
        if (file) {
            const uploadResponse = await fileManager.uploadFile(file, {
                mimeType: "application/pdf",
                displayName: "Gemini 1.5 PDF",
            });

            const fileUri = uploadResponse.file.uri;
            if (!fileUri) {
                throw new Error("File upload failed: No file URI returned.");
            }

            const getResponse = await fileManager.getFile(uploadResponse.file.name);
            console.log(`Retrieved file ${getResponse.displayName} as ${getResponse.uri}`);
            result = await model.generateContent(query,[
                {
                    fileData: {
                        mimeType: uploadResponse.file.mimeType,
                        fileUri: uploadResponse.file.uri
                    }
                },
                { text: query},
            ]);
        } else {
            result = await model.generateContent(prompt);
        }
        if (!result || !result.response || !result.response.text) {
            throw new Error("Invalid response from the generative model.");
        }
        const data = result.response.text();
        return data
    } catch (error) {
        console.log("Something went wrong to fetch data");
    }
}

export { chatResult }