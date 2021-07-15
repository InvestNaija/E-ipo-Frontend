import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/_shared/services/api.service';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { AuthService } from '@app/_shared/services/auth.service';
import { CommonService } from '@app/_shared/services/common.service';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { FormErrors, ValidationMessages } from './documents.validators';

@Component({
  selector: 'in-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  myForm: FormGroup;
  errors = [];
  formErrors = FormErrors;
  uiErrors = FormErrors;
  validationMessages = ValidationMessages;
  loading: boolean;

  documents = [
    {id: 'profOfAddress', title: 'Proof of Address', IdType: null, idNumber: null
      , selectedFile:null, pondFile: [], storeIn: 'driverLicense', loading: false,
      types:[
        {code: 'passport', value:  'passportNo', label: 'International Passport Number'},
        {code: 'driverLicense', value:  'driverLicenseNo', label: 'Driver\'s License'},
        {code: 'utility', value:  'utilityNo', label: 'Utility Bills'},
        {code: 'nationalId', value:  'nationalIdNo', label: 'National Identity Card'}
      ]
    },
    {id: 'profOfId', title: 'Proof of Id', IdType: null, idNumber: null
      , selectedFile:null, pondFile: [], storeIn: 'utility', loading: false,
      types:  [
        {code: 'passport', value:  'passportNo', label: 'International Passport Number'},
        {code: 'driverLicense', value:  'driverLicenseNo', label: 'Driver\'s License'},
        {code: 'nationalId', value:  'nationalIdNo', label: 'National Identity Card'}
      ]},
    {id: 'signature', title: 'Signature', IdType: null, idNumber: null
        , selectedFile:null, pondFile: [], storeIn: 'passport', loading: false,
        types:  [
          {code: 'signature', value:  'passportNo', label: 'Signature'},
      ]}
  ]

  pondOptions = {
    class: 'my-filepond',
    labelIdle: 'Drop files here',
    acceptedFileTypes: 'image/png, image/jpeg, image/gif'
  };
  constructor(
    private apiService: ApiService,
    private auth: AuthService,
    private http: HttpClient,
    private appContext: ApplicationContextService,
    public commonServices: CommonService
    ) { }

  ngOnInit(): void {
    this.commonServices.isLoading$.pipe(
      switchMap(loading => {
        return this.appContext.userInformationObs();
      })
    ).subscribe(user => {
      this.documents.map(doc => {
        if(user[doc.storeIn]) {
          doc.IdType = {label: doc.title};
          doc.id == 'signature'? doc.IdType.code = 'signature' : ''
          user[doc.storeIn] ? doc.pondFile.push(user[doc.storeIn]) : 0;
          doc.idNumber = user[doc.storeIn + 'No'];
        }
      });
    })

    // this.loading = true;
    // this.apiService.get('/api/v1/customers/documents/fetch')
    //   .subscribe(response => {
    //     this.loading = false;
    //     this.appContext.userInformation = response.data
    //     this.documents.map(doc => {
    //       if(response.data[doc.storeIn]) {
    //         doc.IdType = {label: doc.title};
    //         doc.id == 'signature'? doc.IdType.code = 'signature' : ''
    //         response.data[doc.storeIn] ? doc.pondFile.push(response.data[doc.storeIn]) : 0;
    //         doc.idNumber = response.data[doc.storeIn + 'No'];
    //       }
    //     })
    //   },
    //   errResp => {
    //     this.loading = false;
    //     Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
    //   });
  }
  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }
  beforeAdd(file: any) {
    console.log(file)
  }
  pondHandleAddFile(document, event: any) {
    // console.log( = .firstFile)
    document.selectedFile = event.file.getFileEncodeDataURL();
  }
  onSaveFile(document: any) {
    if(!document.IdType) {
      Swal.fire('', `Please select ${document.title} type first`, 'error');
      return;
    }
    if(document.IdType?.code !== 'utility' && document.IdType?.code !== 'signature' && !document.idNumber ) {
      Swal.fire('', `You need to provide ${document.title} number`, 'error');
      return;
    }
    if(!document.selectedFile ) {
      Swal.fire('', `No image uploaded for ${document.title}`, 'error');
      return;
    }
    Swal.fire({
      title: 'Upload Document!',
      text: "Are you sure you want to upload document?",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const fd = new FormData();
        fd.append(document.storeIn, this.DataURIToBlob(document.selectedFile) );
        fd.append(document.storeIn + 'No', document.idNumber);

        // console.log(fd, document); return;
        let headers = new HttpHeaders()
          .append('Authorization', `${this.auth.getToken()}`);
          document.loading = true;
        this.http.post('/api/v1/customers/upload-documents', fd, {headers: headers})
            .subscribe((response: any) => {
              document.loading = true;
              Swal.fire('Great!', response?.message, 'success')
            },
            errResp => {
              document.loading = true;
              Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
            })
      }
    });
  }
}
