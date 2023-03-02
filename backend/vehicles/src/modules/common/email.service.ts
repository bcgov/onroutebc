/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class EmailService {
  constructor(private readonly httpService: HttpService) {}

  async sendEmailMessage(): Promise<string> {
    const reqData = 'grant_type=client_credentials';

    const reqConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: process.env.CHES_CLIENT_ID,
        password: process.env.CHES_CLIENT_SECRET,
      },
    };

    const token = await lastValueFrom(
      this.httpService.post(
        'https://dev.loginproxy.gov.bc.ca/auth/realms/comsvcauth/protocol/openid-connect/token',
        reqData,
        reqConfig,
      ),
    )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error.response);
        return error.response;
      });

    const requestData = {
      bcc: [],
      bodyType: 'html',
      body: "<h1>Welcome to OnRouteBC</h1><p>Sent by <a href='https://onroutebc.gov.bc.ca/'>ORBC</a></p>",
      cc: [],
      delayTS: 0,
      encoding: 'utf-8',
      from: 'noreply-OnRouteBC@gov.bc.ca',
      priority: 'normal',
      subject: 'ORBC Email Message',
      to: ['praveen.1.raju@gov.bc.ca'],
      // "tag": "email_{{session_tag}}",
      // "attachments": [
      //   {
      //     "content": "IyBDb21tb24gSG9zdGVkIEVtYWlsIFNlcnZpY2UKTmVlZCB0byBzZW5kIGVtYWlscz8gTmVlZCB0byBzZW5kIGJ1bGsgZW1haWxzPyBOZWVkIHRvIHNlbmQgdGVtcGxhdGVkIG1lc3NhZ2VzIHBvcHVsYXRlZCBmcm9tIGEgZGF0YXNldD8gTmVlZCB0byBzY2hlZHVsZSBkZWxpdmVyeSBvZiBlbWFpbHM/ICAKClRoZSBDSEVTIEFQSSBpcyBjYXBhYmxlIG9mIGRvaW5nIHRoZSBmb2xsb3dpbmc6CgoqIFNlbmQgZW1haWxzIHdpdGggYXR0YWNobWVudHMgYW5kIHNwZWNpYWwgYnVzaW5lc3MgdGFnZ2luZy4gCiogU2NoZWR1bGUgZm9yIGRlbGF5ZWQgZGVsaXZlcnksIHdpdGggYWJpbGl0eSB0byBjYW5jZWwuIAoqIENyZWF0ZSBidWxrIGVtYWlsIG1lcmdlIHdpdGggeW91ciBvd24gdGVtcGxhdGVzLiAgCiogU2VuZCBwbGFpbiB0ZXh0IG9yIEhUTUwgZW1haWxzLiAKKiBUcmFjayB0aGUgc3RhdHVzIG9mIHlvdXIgcmVxdWVzdC4gCgpSZXZpZXcgdGhlIHYxIEFQSSBzcGVjaWZpY2F0aW9uIFtoZXJlXShodHRwczovL2NoZXMtbWFzdGVyLTlmMGZiZS1wcm9kLnBhdGhmaW5kZXIuZ292LmJjLmNhL2FwaS92MS9kb2NzKS4gIAoKU2VlIFNob3djYXNlIGFwcGxpY2F0aW9uIFtoZXJlXShodHRwczovL21zc2MucGF0aGZpbmRlci5nb3YuYmMuY2EvbXNzYy8pLiAgCgpTZWUgc291cmNlIGNvZGUgW2hlcmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9iY2dvdi9jb21tb24taG9zdGVkLWVtYWlsLXNlcnZpY2UpLiAgCgpNb3JlIGluZm9ybWF0aW9uIFtoZXJlXShodHRwczovL2JjZ292LmdpdGh1Yi5pby9jb21tb24taG9zdGVkLWVtYWlsLXNlcnZpY2UvKS4gIAoKIyBDb21tb24gRG9jdW1lbnQgR2VuZXJhdGlvbiBTZXJ2aWNlCkxldmVyYWdlIHlvdXIgc3RydWN0dXJlZCBkYXRhc2V0cyBhbmQgeW91ciBidXNpbmVzcyB0ZW1wbGF0ZXMgdG8gYXV0b21hdGljYWxseSBwb3B1bGF0ZSBwcmludGFibGUgZG9jdW1lbnRzLCBzcHJlYWRzaGVldHMsIHByZXNlbnRhdGlvbnMsIG9yIFBERnMgdXNpbmcgdGhlIENvbW1vbiBEb2N1bWVudCBHZW5lcmF0aW9uIFNlcnZpY2UuICAKClRoZSBBUEkgY2FuIGdlbmVyYXRlIGFueSBQREYgb3IgWE1MLWJhc2VkIGRvY3VtZW50cyBzdWNoIGFzIGRvY3gsIHhsc3gsIHBwdHgsIG9kdCwgb2RzLCBvZHAsIGFuZCBodG1sLiBFeGFtcGxlcyBvZiBYTUwtYmFzZWQgZWRpdG9ycyBpbmNsdWRlIE1pY3Jvc29mdCBPZmZpY2XihKIsIExpYnJlT2ZmaWNl4oSiIG9yIE9wZW5PZmZpY2XihKIuCgpUaGUgQ0RPR1MgQVBJIGlzIGNhcGFibGUgb2YgZG9pbmcgdGhlIGZvbGxvd2luZzoKCiogTWVyZ2UgY29tcGxleCBkYXRhc2V0cyBpbnRvIGRvY3VtZW50IHRlbXBsYXRlcy4gCiogU3VwcG9ydHMgYW55IFhNTC1iYXNlZCBkb2N1bWVudCB0ZW1wbGF0ZXMgaW5jbHVkaW5nIGJ1dCBub3QgbGltaXRlZCB0byBNaWNyb3NvZnQgT2ZmaWNl4oSiLCBMaWJyZU9mZmljZeKEoiBvciBPcGVuT2ZmaWNl4oSiLiAKKiBSaWNoIHRlbXBsYXRpbmcgbGlicmFyeSBzdXBwb3J0IGxldmVyYWdpbmcgdGhlIENhcmJvbmUgSlMgbGlicmFyeS4gCgpSZXZpZXcgdGhlIHYxIEFQSSBzcGVjaWZpY2F0aW9uIFtoZXJlXShodHRwczovL2Nkb2dzLW1hc3Rlci1pZGNxdmwtcHJvZC5wYXRoZmluZGVyLmdvdi5iYy5jYS9hcGkvdjEvZG9jcyN0YWcvRG9jR2VuKS4gIAoKUmV2aWV3IHRoZSB2MiBBUEkgc3BlY2lmaWNhdGlvbiBbaGVyZV0oaHR0cHM6Ly9jZG9ncy1tYXN0ZXItaWRjcXZsLXByb2QucGF0aGZpbmRlci5nb3YuYmMuY2EvYXBpL3YyL2RvY3MjdGFnL0RvY0dlbikuICAKClNlZSBTaG93Y2FzZSBhcHBsaWNhdGlvbiBbaGVyZV0oaHR0cHM6Ly9kZ3JzYy5wYXRoZmluZGVyLmdvdi5iYy5jYS9kZ3JzYy8pLiAgCgpTZWUgc291cmNlIGNvZGUgW2hlcmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9iY2dvdi9jb21tb24tZG9jdW1lbnQtZ2VuZXJhdGlvbi1zZXJ2aWNlKS4gIAoKTW9yZSBpbmZvcm1hdGlvbiBbaGVyZV0oaHR0cHM6Ly9iY2dvdi5naXRodWIuaW8vY29tbW9uLWRvY3VtZW50LWdlbmVyYXRpb24tc2VydmljZS8pLiAgCgoKIyMjIyBDb21tb24gU2VydmljZXMgU2hvd2Nhc2UKVmlzaXQgW0NvbW1vbiBTZXJ2aWNlcyBTaG93Y2FzZV0oaHR0cHM6Ly9iY2dvdi5naXRodWIuaW8vY29tbW9uLXNlcnZpY2Utc2hvd2Nhc2UvKSBmb3IgbW9yZSBpbmZvcm1hdGlvbjsgaW5jbHVkaW5nIGhvdyB0byBnZXQgYWNjZXNzIHRvIGNvbW1vbiBzZXJ2aWNlcy4gICA=",
      //     "contentType": "text/markdown",
      //     "encoding": "base64",
      //     "filename": "readme.md"
      //   }
      // ]
    };

    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token.access_token,
      },
    };

    const responseData = await lastValueFrom(
      this.httpService
        .post(
          'https://ches-dev.api.gov.bc.ca/api/v1/email',
          requestData,
          requestConfig,
        )
        .pipe(
          map((response) => {
            return response;
          }),
        ),
    )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error.response);
        return error.response;
      });

    return responseData;
  }
}
