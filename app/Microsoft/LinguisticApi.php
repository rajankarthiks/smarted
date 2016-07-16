<?php

namespace App\Microsoft;

use Illuminate\Support\Arr;
use GuzzleHttp\ClientInterface;

class LinguisticApi extends AbstractApi
{
    protected $analyzersListUrl = 'https://api.projectoxford.ai/linguistics/v1.0/analyzers';

    protected $apiUrl = 'https://api.projectoxford.ai/linguistics/v1.0/analyze';

    protected $analysedText;

    public function getAnalyzers()
    {
        $response = $this->getHttpClient()->get($this->analyzersListUrl, [
            'headers' => [
                'Ocp-Apim-Subscription-Key' => $this->apiKey,
            ]
        ]);

        return json_decode($response->getBody());
    }


    public function getAnalysisResponse()
    {
        $response = $this->getHttpClient()->post($this->apiUrl, [
            'headers' => [
                'Content-Type' => 'application/json',
                'Ocp-Apim-Subscription-Key' => $this->apiKey,
            ],
            'json' => $this->getPostFields(),
        ]);

        $this->analysedText =  json_decode($response->getBody());

        return $this->getInsightsForAnalysedText();

    }

    protected function getInsightsForAnalysedText()
    {

        return $this->getTokenizedInsights();

    }

    protected function getTokenizedInsights()
    {
        $analyzerId = $this->getAnalyzerIDs()['tokenizer'];

        $result = collect($this->analysedText)->filter(function($value,$key) use ($analyzerId) {
              $result = (array) $value;
              return $result['analyzerId'] == $analyzerId;
        })->flatten()->first()->result;

        $total_length = 0;

        $total_length = collect($result)->map(function ($sentence,$key) use ($total_length) {
            return $total_length + $sentence->Len;
        })->toArray()[0];

        $sentences = collect($result)->map(function ($sentence,$key) {
            return [
              'length' => $sentence->Len,
              'offset' => $sentence->Offset,
              'words'  => $words = collect($sentence->Tokens)->map(function ($word,$key) {
                  return [
                    'length' => $word->Len,
                    'offset' => $word->Offset,
                    'original_word' => $word->RawToken,
                    'corrected_word' => $word->NormalizedToken,
                  ];
              }),
              'no_of_words'  => $words->count(),
            ];
        });

        $response = [
          'total_length'    => $total_length,
          'no_of_sentences' => count($result),
          'sentences'       => $sentences,
        ];

        return $response;

    }

    public static function analyze($text)
    {

      $key = config('services.microsoft.linguistic_api');

      return (new static($text,$key))->getAnalysisResponse();

    }


    public static function listAnalyzers()
    {

      $key = config('services.microsoft.linguistic_api');

      return (new static(NULL, $key))->getAnalyzers();

    }

}
