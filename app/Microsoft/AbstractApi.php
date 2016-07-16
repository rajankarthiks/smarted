<?php

namespace App\Microsoft;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use GuzzleHttp\ClientInterface;

abstract class AbstractApi
{
    protected $apiKey;

    protected $text;

    protected $httpClient;

    public function __construct($text = NULL, $apiKey)
    {
        $this->text = $text;
        $this->apiKey = $apiKey;
    }

    protected function getPostFields()
    {
        return [
            "language" => "en",
            "analyzerIds" => array_values($this->getAnalyzerIDs()),
            "text" => $this->text,
        ];
    }

    protected function getAnalyzerIDs()
    {
        return [
          "pos_tags" => "4fa79af1-f22c-408d-98bb-b7d7aeef7f04",
          "costituency_tree" => "22a6b758-420f-4745-8a3c-46835a67c0d2",
          "tokenizer" => "08ea174b-bfdb-4e64-987e-602f85da7f72",
        ];
    }

    protected function getHttpClient()
    {
        if (is_null($this->httpClient)) {
            $this->httpClient = new Client();
        }

        return $this->httpClient;
    }

    public function setRequest(Request $request)
    {
        $this->request = $request;

        return $this;
    }


}
