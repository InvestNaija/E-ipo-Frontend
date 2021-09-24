import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { ApiService } from '@app/_shared/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';


export interface PeriodicElement {
  position: number;
  course: string;
  courseFee: number;
  category: string;
  scheduled: string;
  published: string;
  status: string;
}

@Component({
  selector: 'in-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FAQComponent implements OnInit  {

  constructor(
    private router: Router,
    private api: ApiService,
    private appService: ApplicationContextService,
  ) { }

  faqs = [
    {question: 'What is the MTN Offer?', answer: 'MTN Group is desirous of selling down, over time, up to 2,814,830,718 shares in MTN Nigeria and reduce its shareholding in MTN Nigeria from 78.83% to 65%.'},
    {question: 'How will the shares be sold?', answer: 'MTN Group is desirous of selling down, over time, up to 2,814,830,718 shares in MTN Nigeria and reduce its shareholding in MTN Nigeria from 78.83% to 65%.'},
    {question: 'What is an offer for sale?', answer: 'When a shareholder or a company sells existing shares in the company to the investing public, by way of an offer.'},
    {question: 'Are MTN Nigeria shares listed on any exchange?', answer: 'Yes, the existing shares are already listed and trade on the Nigerian Exchange Limited (NGX).'},
    {question: 'How many shares are being offered?', answer: 'Up to 575,000,000 shares (and can be increased by an additional 15%, if there is demand).'},
    {question: 'Who is selling the shares?', answer: 'MTN Group, the core shareholder in MTN Nigeria, through MTN International (Mauritius) Limited.'},
    {question: 'What is the purpose of the offer for sale?', answer: 'The Offer supports MTN Group’s stated intention of extending ownership of MTN Nigeria by Nigerians.'},
    {question: 'What is the price?', answer: 'The Offer supports MTN Group’s stated intention of extending ownership of MTN Nigeria by Nigerians.'},
    {question: 'How will the price be determined?', answer: 'The Price will be determined by a bookbuild a few days into the offer, in reference to the traded market price of MTN Nigeria shares.'},
    {question: 'When will the price be announced?', answer: 'The Price will be announced to investors during the offer period.'},
    {question: 'What is a bookbuild?', answer: 'A process of price and demand discovery, through which the Bookrunner seeks to determine the price at which securities should be issued, based on the demand from Qualified Institutional Investors.'},
    {question: 'Why is the price being determined by a bookbuild and not fixed from Day 1?', answer: 'If the price is fixed throughout the offer period, the traded share price will move, and the shares offered may be far too cheap or far too expensive to be successful.'},
    {question: 'When does the offer open?', answer: '[Friday, October 29, 2021]'},
    {question: 'When does the offer close?', answer: '[Friday, November 19, 2021]'},
    {question: 'How long is the offer opened for?', answer: 'The Offer is open for 3 weeks.'},
    {question: 'What is the minimum value that can be applied for?', answer: 'Minimum of N10,000/investor'},
    {question: 'What is the incentive?', answer: '1 bonus ordinary share for every 20 ordinary shares purchased and allotted, up to a maximum of 250 bonus ordinary shares per investor, purchased and held for 12 months from the allotment date.'},
    {question: 'How will the offer be sold?', answer: 'Through banks, stockbrokers'},
    {question: 'How can I apply?', answer: 'You can submit your application through the Issuing Houses, Stockbrokers and Nigerian banks. Additionally, via web, app and through mobile. It will also be available on digital platforms through Chapel Hill Denham.'},
    {question: 'Who can buy?', answer: 'Anyone with a CSCS account can submit an application. If you do not have a CSCS account, one will be created for you.'},
    {question: 'What is a CSCS Number?', answer: 'The CSCS (Central Securities Clearing System) Number and CHN (Clearing House) Number are investors unique identifier to purchase and/or sell securities. The shares are traded compulsorily in dematerialized form. Accordingly, the relevant details of the CSCS and the beneficiary account must be provided in the “CSCS Account Details” section in your application.'},
    {question: 'I don\'t have a CSCS, can I still apply?', answer: 'Yes, if you do not have a CSCS account, one will be created for you as part of the application process on InvestNaija. Your stockbroker can also assist in setting up a CSCS account for you before you log on to the digital platforms to complete your application.'},
    {question: 'What information should I keep after I submit the application?', answer: 'If you submit through InvestNaija, you will receive a confirmation via email or SMS advising that your application has been successfully submitted. You will also be notified via the same platform of a copy of the application form and payment evidence.'},
    {question: 'Can I submit multiple applications in the same name?', answer: 'No. Multiple applications will be rejected. Only one application is allowed per investor.'},
    {question: 'Can I cancel my application?', answer: 'The application is deemed as received once funded. You can reach out to the Offer Customer Care team if you have any issues regarding your submission.'},
    {question: 'Who are the Issuing Houses?', answer: 'Chapel Hill Denham Advisory Limited is the Lead Issuing House and Bookrunner.<br>The Joint Issuing Houses are Rand Merchant Bank Nigeria, Renaissance Securities (Nigeria) Limited, Stanbic IBTC Capital Limited and Vetiva Capital Management Limited.'},
    {question: 'Who are the Registrars?', answer: 'Coronation Registrars Limited.'},
    {question: 'Is there a possibility for the offer to be extended beyond the 3 weeks?', answer: 'No, the offer will not be extended.'},
    {question: 'What is the basis of allocation?', answer: 'The shares will be allotted in accordance with the SEC Rules that prescribe that all subscribers receive the minimum allocation [N10,000.00] in full, and thereafter the residual balance shall be pro-rated.'},
    {question: 'When will the shares be allotted to me?', answer: 'The Allotment Date will be the date on which the allotment of the shares is cleared by the SEC.'},
    {question: 'When will the shares be credited to my CSCS account?', answer: 'The CSCS accounts of successful applicants will be credited not later than fifteen (15) Working days from the Allotment Date.'},
    {question: 'Will I receive the full amount of shares applied for?', answer: '[x]'},
    {question: 'Can my application be rejected? and why?', answer: 'The Issuing Houses and the Seller reserve the right to accept or reject any application in whole or in part for not meeting the conditions of the Offer. All irregular or suspected multiple applications will be rejected.'},
    {question: 'How will I receive my return monies?', answer: 'Return monies will be transferred to the account number as stated on your application within five (5) Working days of the Allotment Date.'},
    {question: 'Do I need to pay to access and register on InvestNaija?', answer: 'No, registration on InvestNaija is free.'},
    {question: 'Will there be any charges when making payment for the shares on InvestNaija?', answer: '[x]'},
    {question: 'Do I need to pay any statutory charges on the trade?', answer: 'No'},
    {question: 'Are there any tax implications of selling shares allocated?', answer: 'No, capital gain tax is charged on traded shares, however dividends that may be paid to shareholders of MTN Nigeria will be taxed.'},
    {question: 'Who can I call to make enquiries?', answer: '[x]'},
    {question: 'I am unable to download your App', answer: 'Ensure that you have stable/sufficient internet coverage and download the updated version of the “InvestNaija” application from the IOS store for Apple and Playstore for Android systems.'},
    {question: 'I want to create an account but I don\'t have my BVN offhand', answer: 'Kindly dial *565*0# on the phone number linked to your BVN profile for retrieval or contact your Bank‘s customer care for retrieval.'},
    {question: 'I get an error "Date of birth does not match BVN details"', answer: 'Kindly input the correct date of birth on your BVN profile.'},
    {question: 'I am unable to create an investment account as I got an error message "Failed BVN validation"', answer: 'Please ensure that you have input the correct BVN details or contact your Bank’s customer care for further assistance and validation.'},
    {question: 'I am unable to get the One Time Password (OTP)/Verification Link', answer: 'The OTP is sent only to your registered email address/telephone number via SMS. Kindly refresh your email or check your junk/spam folder. Kindly also check to confirm that you are properly connected to the internet.'},
    {question: 'I am unable to login to the app', answer: 'Ensure you have input your correct login details (Email & Password). Ensure that you have stable network on your device.'},
    {question: 'I forgot my Password, how do I retrieve it?', answer: 'Kindly select the "forgot password" option on the landing page and follow the instructions for a password reset.'},
    {question: 'I tried to subscribe to the MTN share offer but I don’t have a CSCS account number', answer: 'Kindly follow the prompt on the application to create a CSCS account and your account details would be forwarded within 24 working hours.'},
    {question: 'The App keeps timing out', answer: 'The application automatically logs you out if idle for a period of time.'},
    {question: 'I get an error to contact my Bank when I tried to make payment with my Card', answer: 'Kindly contact your Bank for card enablement or make use of other available payment options.'},
    {question: 'I got a failed error response after funding but was debited', answer: 'Reversal of funds typically takes 24 working hours. However, you may need to contact your Bank for further assistance.'},
    {question: 'I have been debited but my payment status shows pending', answer: 'Kindly forward your proof of payment to <a href="mailto:mtnnigeriaoffer@investnaija.com">mtnnigeriaoffer@investnaija.com</a> OR <a href="mailto:communication@chapelhilldenham.com">communication@chapelhilldenham.com</a> for further review.'},
    {question: 'I am unable to change my password', answer: 'The password field is case and space sensitive, ensure you input your details correctly and if it persists, please log out and log in again.'},
    {question: 'I am unable to relaunch the app after your recent update.', answer: 'Kindly update your device Operating System (OS) and try again.'},
    {question: 'I received an error response "Page could not be found" while making payment with the USSD option', answer: 'Kindly refresh page to confirm if payment was successful. However, you can subscribe via other payment options.'},
    {question: 'How do I contact your customer care?', answer: 'Kindly refresh page to confirm if payment was successful. However, you can subscribe via other payment options.'},
  ];

  ngOnInit(): void { }
}
