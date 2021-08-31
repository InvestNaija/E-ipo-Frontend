import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/_shared/services/api.service';
import { ApplicationContextService } from '@app/_shared/services/application-context.service';
import { AuthService } from '@app/_shared/services/auth.service';
import { CommonService } from '@app/_shared/services/common.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
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
      ]
    },
    {id: 'signature', title: 'Signature', IdType: null, idNumber: null
        , selectedFile:null, pondFile: [], storeIn: 'passport', loading: false,
        types:  [
          {code: 'signature', value:  'passportNo', label: 'Signature'},
      ]
    }
  ]

  pondOptions = {
    class: 'my-filepond',
    labelIdle: 'Drop files here',
    acceptedFileTypes: 'image/png, image/jpeg, image/gif', //  application/pdf
    maxFileSize: '1MB'
  };
  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private auth: AuthService,
    private http: HttpClient,
    private appContext: ApplicationContextService,
    public commonServices: CommonService
    ) { }

  ngOnInit(): void {
    this.commonServices.isLoading$.pipe(
      switchMap(loading => {
        return this.appContext.userInformationObs();
      }),
      switchMap(loading => {
        // return this.apiService.get('/api/v1/customers/upload-kyc-documents');
        return this.apiService.get('/api/v1/customers/documents/kyc');
      }),
    ).subscribe(documents => {
      this.documents.map(doc => {
        documents.data.forEach(uploaded => {
          const fType = uploaded.name.split(";");
          if(fType[0] === doc.id) {
            doc.IdType =  doc.types.find(type => type.code == fType[1])
            doc.pondFile.push(uploaded.value)
          }
          if(fType[0] === doc.id +'No') {
            doc.idNumber = uploaded.value;
          }
        });
      })
    })
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
    if(event.error) {
      this.toastr.error(event.error.sub, event.error.main);
      return;
    }
    document.selectedFile = event.file.getFileEncodeDataURL();
  }
  onSaveFile(document: any) {
    if(!document.IdType) {
      this.toastr.error(`Please select ${document.title} type first`, 'error');
      return;
    }
    if(document.IdType?.code !== 'utility' && document.IdType?.code !== 'signature' && !document.idNumber ) {
      this.toastr.error(`You need to provide ${document.title} number`, 'error');
      return;
    }
    if(!document.selectedFile ) {
      this.toastr.error( `No image uploaded for ${document.title}`, 'error');
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
        fd.append(document.id + ';' + document.IdType?.code, this.DataURIToBlob(document.selectedFile) );
        fd.append(document.id + 'No' + ';' + document.IdType?.code, document.idNumber);

        // console.log(fd, document); return;
        let headers = new HttpHeaders()
          .append('Authorization', `${this.auth.getToken()}`);
          document.loading = true;
        this.http.post(`${environment.apiUrl}/api/v1/customers/upload-kyc-documents`, fd, {headers: headers})
        // this.apiService.post('/api/v1/customers/upload-kyc-documents', fd)
            .subscribe((response: any) => {
              document.loading = false;
              Swal.fire('Great!', response?.message, 'success')
            },
            errResp => {
              document.loading = false;
              Swal.fire('Oops...', errResp?.error?.error?.message, 'error')
            });
      }
    });
  }
}
