import { Component, OnInit, Inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { TruelyticsUserDetails } from "../../models/truelytics-models";
import { Router } from "@angular/router";

declare const truelytics: any;

@Component({
  selector: 'app-truelytics-peer-benchmarks',
  templateUrl: './truelytics-peer-benchmarks.component.html',
  styleUrls: ['./truelytics-peer-benchmarks.component.css']
})
export class TruelyticsPeerBenchmarksComponent implements OnInit, AfterViewInit {
  details: TruelyticsUserDetails;
  @ViewChild('integration') integration: ElementRef;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private router: Router) {
    http.get<TruelyticsUserDetails>(baseUrl + 'api/truelytics/user-details').subscribe(result => {
      this.details = result;
      console.debug('truelytics user details', this.details);

      if (!this.details.truelyticsApiKey || !this.details.truelyticsUserId) {
        this.router.navigate(['truelytics', 'connect'], { queryParams: { redirect: '/truelytics/peer-benchmarks' } });
      }
    }, error => console.error('truelytics auth token error', error));
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.http.get(this.baseUrl + 'api/truelytics/auth/token', { responseType: 'text' }).subscribe(token => {
      truelytics.xd.consumer.login(token, results => {
        console.log('login success?', results, this.integration.nativeElement);

        if (results.success) {
          truelytics.xd.consumer.addFrame('/TruePerformance/Analytics/EmbeddedPeerBenchmarks', this.integration.nativeElement);
        }
        else {
          console.error('unable to use sso token', results);
        }
      });
    }, error => {
      console.error('truelytics auth token error', error);
      //this.router.navigate(['truelytics', 'connect'], { queryParams: { redirect: '/truelytics/peer-benchmarks' } });
    });
  }
}
