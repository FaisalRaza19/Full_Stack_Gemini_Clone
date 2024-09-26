import { GoogleGenerativeAI } from "@google/generative-ai";

const autoChatName = async (inputQuery) => {
    try {
        const wordCount = inputQuery.split(' ').length

        if (wordCount < 1) {
            return inputQuery;
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Suggest four names based on the following query: "${inputQuery}". Give perfect name for this and only give the name and nothing else. If the user gives code, provide a perfect name according to their query; otherwise, provide "Modified Code."`;
        const result = await model.generateContent(prompt);

        if (!result || !result.response || typeof result.response.text !== 'function') {
            console.error('Invalid response format:', result);
            return "Untitled Chat";
        }

        const dataString = await result.response.text();

        if (!dataString) {
            console.error('Empty data string received');
            return "Untitled Chat";
        }

        const lines = dataString.split('\n').filter(line => line.trim() !== '');

        if (lines.length === 0) {
            console.error('No valid lines in response');
            return "Untitled Chat";
        }

        // Extract the first line and handle numbered responses
        const firstLine = lines[0].trim();
        const firstValue = firstLine.split('. ')[1] || firstLine;

        // Add space before capital letters, only if no space exists before them
        let spacedName = firstValue.replace(/(?!\s)([A-Z])/g, ' $1').trim();

        // Remove extra spaces between words
        spacedName = spacedName.replace(/\s+/g, ' ').trim();

        // Remove leading hyphen if present
        spacedName = spacedName.replace(/^-+\s*/, '');

        return spacedName;
    } catch (error) {
        console.error('Error generating names:', error);
        return "Untitled Chat";
    }
};

export { autoChatName };