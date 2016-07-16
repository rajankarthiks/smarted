<?php

namespace App\Microsoft;

use Illuminate\Support\Arr;
use GuzzleHttp\ClientInterface;

class LinguisticApi extends AbstractApi
{
    protected $apiUrl = 'https://api.projectoxford.ai/linguistics/v1.0/analyze';

    public function getAnalysisResponse()
    {
        $postKey = (version_compare(ClientInterface::VERSION, '6') === 1) ? 'form_params' : 'body';

        // $response = $this->getHttpClient()->post($this->apiUrl, [
        //     'headers' => [
        //         'Content-Type' => 'application/json',
        //         'Ocp-Apim-Subscription-Key' => $this->apiKey,
        //     ],
        //     $postKey => $this->getPostFields(),
        // ]);

        $response = $this->getHttpClient()->post($this->apiUrl, [
            'headers' => [
                'Ocp-Apim-Subscription-Key' => $this->apiKey,
            ],
        ]);

        return json_decode($response->getBody());

    }


    public static function analyze($text)
    {

      $key = config('services.microsoft.linguistic_api');

      return (new static($text,$key))->getAnalysisResponse();

    }


}
