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

    public function __construct($text, $apiKey)
    {
        $this->text = $text;
        $this->apiKey = $apiKey;
    }

    protected function getPostFields()
    {
        return [
            "language" => "en",
            "analyzerIds" => ["4fa79af1-f22c-408d-98bb-b7d7aeef7f04"],
            "text" => $this->text,
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
