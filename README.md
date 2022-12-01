# AWS Apigateway HTTP helpers

A package useful when developing serverless functions using AWS Lambda/Apigateway. It contains:

## V2/Response
A response object with several methods for common http responses. Return these from your lambda handler:

```
import { Response } from @gemeentenijmegen/apigateway-http/lib/V2/Response;

// Redirect to https://example.com
Response.redirect('https://example.com');

// Permanently redirect to https://example.com
Response.redirect('https://example.com', 301);

// Return http 403: Not allowed response
Response.error(403);

// Return a html page
Response.html('<!doctype html><html><head><title>My page</title></head><body>The html body</body></html>');
```