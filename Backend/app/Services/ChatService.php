<?php

namespace App\Services;

use App\Contracts\Services\ChatServiceInterface;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Http;

class ChatService extends BaseService implements ChatServiceInterface
{
    private const SYSTEM_PROMPT = 'You are a helpful AI assistant. You answer questions about technology, ' .
        'programming, software development, DevOps, databases, web development, ' .
        'mobile development, AI/ML, system design, and general coding. ' .
        'Be concise, accurate, and helpful. Keep responses focused. ' .
        'Use markdown formatting for code blocks when relevant. ' .
        'If you are unsure about something, say so honestly rather than guessing.';

    public function chat(array $messages): array
    {
        $apiKey = config('services.groq.api_key');

        if (! $apiKey) {
            throw new \RuntimeException('Chat service is not configured.', 503);
        }

        $model = config('services.groq.model', 'llama-3.3-70b-versatile');
        $apiMessages = $this->prepareMessages($messages);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => $model,
                'messages' => $apiMessages,
                'max_tokens' => 1024,
                'temperature' => 0.7,
            ]);

            if (! $response->successful()) {
                $error = $response->json('error.message', 'Chat service error.');
                throw new \RuntimeException($error, 502);
            }

            $data = $response->json();
            $content = $data['choices'][0]['message']['content'] ?? 'No response generated.';

            return [
                'message' => $content,
                'model' => $model,
            ];
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            throw new \RuntimeException('Chat service timed out. Please try again.', 504);
        }
    }

    public function stream(array $messages): void
    {
        $apiKey = config('services.groq.api_key');
        $model = config('services.groq.model', 'llama-3.3-70b-versatile');
        $apiMessages = $this->prepareMessages($messages);

        try {
            $client = new Client();

            $response = $client->post('https://api.groq.com/openai/v1/chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'model' => $model,
                    'messages' => $apiMessages,
                    'max_tokens' => 1024,
                    'temperature' => 0.7,
                    'stream' => true,
                ],
                'stream' => true,
                'timeout' => 30,
            ]);

            $body = $response->getBody();
            $buffer = '';

            while (! $body->eof()) {
                $chunk = $body->read(1024);
                $buffer .= $chunk;

                while (($pos = strpos($buffer, "\n")) !== false) {
                    $line = substr($buffer, 0, $pos);
                    $buffer = substr($buffer, $pos + 1);
                    $line = trim($line);

                    if (empty($line) || ! str_starts_with($line, 'data: ')) {
                        continue;
                    }

                    $data = substr($line, 6);

                    if ($data === '[DONE]') {
                        echo "data: [DONE]\n\n";
                        flush();
                        return;
                    }

                    $json = json_decode($data, true);

                    if (isset($json['choices'][0]['delta']['content'])) {
                        $token = $json['choices'][0]['delta']['content'];
                        echo "data: " . json_encode(['content' => $token]) . "\n\n";
                        flush();
                    }
                }
            }
        } catch (\Exception $e) {
            echo "data: " . json_encode(['error' => 'Stream failed.']) . "\n\n";
            flush();
        }
    }

    private function prepareMessages(array $messages): array
    {
        $systemMessage = [
            'role' => 'system',
            'content' => self::SYSTEM_PROMPT,
        ];

        return array_merge([$systemMessage], $messages);
    }
}
