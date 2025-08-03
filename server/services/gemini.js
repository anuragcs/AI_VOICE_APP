const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
    constructor() {
        // Add validation for API key
        if (!process.env.GEMINI_API_KEY) {
          throw new Error('GEMINI_API_KEY is not defined in environment variables');
        }
        
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
        });
        this.activeConversation = null;
    }

    async startConversation() {
        try {
            // Test the API key first
            const testResult = await this.model.generateContent("Hello");
            console.log("Gemini API test successful");
            
            this.activeConversation = await this.model.startChat({
                history: [],
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });
            return { status: "conversation_started" };
        } catch (error) {
            console.error("Error starting conversation:", error);
            
            // Handle rate limiting
            if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('Too Many Requests')) {
                throw new Error('API rate limit exceeded. You have reached the free tier limit. Please wait a few minutes or upgrade your Gemini API plan.');
            }
            
            if (error.message.includes('API_KEY') || error.message.includes('authentication')) {
                throw new Error('Invalid or missing Gemini API key. Please check your .env file.');
            }
            
            throw new Error(`Failed to start conversation: ${error.message}`);
        }
    }

    async processText(text) {
        try {
            if (!this.activeConversation) {
                await this.startConversation();
            }

            console.log('Processing text input:', text);
            
            const result = await this.activeConversation.sendMessage(text);
            const response = await result.response;
            const responseText = response.text();

            console.log('Gemini text response:', responseText);

            return { 
                text: responseText,
                status: "success"
            };
        } catch (error) {
            console.error("Error processing text:", error);
            
            // Handle rate limiting
            if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('Too Many Requests')) {
                throw new Error('API rate limit exceeded. You have reached the free tier limit. Please wait a few minutes or upgrade your Gemini API plan.');
            }
            
            throw new Error(`Failed to process text: ${error.message}`);
        }
    }

    async processAudio(audioFile) {
        try {
            if (!this.activeConversation) {
                await this.startConversation();
            }

            // Convert audio file to base64 for Gemini
            const audioData = audioFile.data.toString('base64');
            
            console.log('Processing audio file:', {
                name: audioFile.name,
                mimetype: audioFile.mimetype,
                size: audioFile.size
            });
            
            // Check if audio file is too small (likely empty or corrupted)
            if (audioFile.size < 1000) {
                return {
                    text: "The audio recording seems too short or empty. Please try recording again and speak clearly for at least 2-3 seconds.",
                    status: "audio_too_short"
                };
            }
            
            // Try multiple audio formats for better compatibility
            const audioFormats = [
                audioFile.mimetype || 'audio/webm',
                'audio/webm',
                'audio/mp4',
                'audio/mpeg',
                'audio/wav',
                'audio/ogg'
            ];
            
            for (const format of audioFormats) {
                try {
                    console.log(`Trying audio format: ${format}`);
                    
                    const result = await this.activeConversation.sendMessage([
                        {
                            inlineData: {
                                mimeType: format,
                                data: audioData
                            }
                        },
                        {
                            text: "Please carefully transcribe the speech in this audio and then respond naturally to what was said. If you cannot clearly understand the speech, please ask the user to repeat their message more clearly. Focus on understanding the actual words spoken, not background sounds."
                        }
                    ]);

                    const response = await result.response;
                    const text = response.text();

                    console.log('Gemini response:', text);

                    // Check if the response is meaningful and not just describing sounds
                    if (text && 
                        text.length > 10 && 
                        !text.includes("I can't process") &&
                        !text.includes("making a") &&
                        !text.includes("sound that seems") &&
                        !text.includes("background noise") &&
                        !text.toLowerCase().includes("unclear") &&
                        !text.toLowerCase().includes("cannot understand")) {
                        return { 
                            text: text,
                            status: "success"
                        };
                    } else {
                        console.log('Response seems to describe sounds rather than transcribe speech, trying next format...');
                        continue;
                    }
                } catch (formatError) {
                    console.log(`Format ${format} failed:`, formatError.message);
                    continue;
                }
            }
            
            // If all formats fail, return a helpful message
            return {
                text: "I'm having trouble understanding your audio. Please try:\n1. Speaking more clearly and slowly\n2. Reducing background noise\n3. Speaking closer to the microphone\n4. Using the text input instead",
                status: "audio_processing_failed"
            };
            
        } catch (error) {
            console.error("Error processing audio:", error);
            
            // Handle rate limiting
            if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('Too Many Requests')) {
                throw new Error('API rate limit exceeded. You have reached the free tier limit. Please wait a few minutes or upgrade your Gemini API plan.');
            }
            
            // If it's an API key error, provide a helpful message
            if (error.message.includes('API_KEY')) {
                throw new Error('Invalid or missing Gemini API key. Please check your .env file.');
            }
            
            throw new Error(`Failed to process audio: ${error.message}`);
        }
    }

    async interrupt() {
        try {
            if (this.activeConversation) {
                // Instead of completely resetting, we'll keep the conversation
                // but add a context marker that the user interrupted
                console.log('User interrupted the conversation');
            }
            return { 
                status: "interrupted",
                message: "Conversation interrupted. Ready for new input."
            };
        } catch (error) {
            console.error("Error interrupting conversation:", error);
            throw new Error(`Failed to interrupt: ${error.message}`);
        }
    }
}

module.exports = new GeminiService();