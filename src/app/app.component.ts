import {Component, OnInit} from '@angular/core';
import {
  ApiResponseData,
  Constants,
  CountQueryResponse,
  CreateIntValue,
  CreateValue,
  DeleteValue,
  DeleteValueResponse,
  KnoraApiConfig,
  KnoraApiConnection,
  ListNode,
  LoginResponse,
  ReadOntology,
  ReadResource,
  UpdateIntValue,
  UpdateResource,
  UpdateValue,
  UserCache,
  UsersResponse,
  WriteValueResponse,
  UserResponse
} from '@knora/api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  knoraApiConnection: KnoraApiConnection;

  userCache: UserCache;

  ontologies: Map<string, ReadOntology>;

  resource: ReadResource;

  listNode: ListNode;

  searchResult: ReadResource[];
  size: number;

  loginStatus = '';

  valueStatus = '';

  ngOnInit() {
    const config = new KnoraApiConfig('http', '0.0.0.0', 3333, undefined, undefined, true);
    this.knoraApiConnection = new KnoraApiConnection(config);
    // console.log(this.knoraApiConnection);
    this.userCache = new UserCache(this.knoraApiConnection);
  }

  login() {

    this.knoraApiConnection.v2.auth.login('username', 'root', 'test').subscribe(
      (loginResponse: ApiResponseData<LoginResponse>) => {
        console.log(loginResponse);
        this.loginStatus = 'logged in';

      },
      error => console.error(error)
    );

  }

  logout() {

    this.knoraApiConnection.v2.auth.logout().subscribe(
      logoutRes => {
        console.log(logoutRes);
        this.loginStatus = 'logged out';
      },
      error => console.error(error)
    );

  }

  getUsers() {

    this.knoraApiConnection.admin.usersEndpoint.getUsers().subscribe(
      (a: ApiResponseData<UsersResponse>) => console.log(a.body.users),
      b => console.error(b)
    );

  }

  getUser(email: string) {
    this.knoraApiConnection.admin.usersEndpoint.getUser('email', email).subscribe(
      (a: ApiResponseData<UserResponse>) => console.log(a.body.user),
      b => console.error(b)
    );
  }

  getOntology(iri: string) {

    this.knoraApiConnection.v2.ontologyCache.getOntology(iri).subscribe(
      onto => {
        console.log('onto ', onto);
        this.ontologies = onto;
      }
    );
  }

  getResourceClass(iri: string) {

    this.knoraApiConnection.v2.ontologyCache.getResourceClassDefinition(iri).subscribe(
      onto => {
        console.log(onto);
      }
    );
  }

  getResource(iri: string) {

    this.knoraApiConnection.v2.res.getResource(iri).subscribe(
      (res: ReadResource) => {
        console.log(res);
        this.resource = res;

      },
      (error) => {

      }
    );

  }

  getListNode(listNodeIri: string) {

    this.knoraApiConnection.v2.listNodeCache.getNode(listNodeIri).subscribe(
      (res: ListNode) => {
        console.log(res);

        this.listNode = res;

      }
    );
  }

  fulltextSearch(searchTerm: string) {

    this.knoraApiConnection.v2.search.doFulltextSearch(searchTerm, 0).subscribe(
      (res: ReadResource[]) => {
        console.log(res);
        this.searchResult = res;
        this.size = res.length;
      }
    );
  }

  fulltextSearchCountQuery(searchTerm: string) {

    this.knoraApiConnection.v2.search.doFulltextSearchCountQuery(searchTerm, 0).subscribe(
      (res: CountQueryResponse) => {
        console.log(res);
        this.size = res.numberOfResults;
      }
    );
  }

  labelSearch(searchTerm: string) {

    this.knoraApiConnection.v2.search.doSearchByLabel(searchTerm, 0).subscribe(
      (res: ReadResource[]) => {
        console.log(res);
        this.searchResult = res;
        this.size = res.length;
      }
    );
  }

  extendedSearch() {

    const gravsearchQuery = `
                PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
                CONSTRUCT {

                    ?mainRes knora-api:isMainResource true .

                } WHERE {

                    ?mainRes a knora-api:Resource .

                    ?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .
                }

                OFFSET 0
            `;

    this.knoraApiConnection.v2.search.doExtendedSearch(gravsearchQuery).subscribe(
      (res: ReadResource[]) => {
        console.log(res);
        this.searchResult = res;
        this.size = res.length;
      }
    );
  }

  extendedSearchCountQuery() {

    const gravsearchQuery = `
                PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
                CONSTRUCT {

                    ?mainRes knora-api:isMainResource true .

                } WHERE {

                    ?mainRes a knora-api:Resource .

                    ?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .
                }

                OFFSET 0
            `;

    this.knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearchQuery).subscribe(
      (res: CountQueryResponse) => {
        console.log(res);
        this.size = res.numberOfResults;
      }
    );
  }

  generateUpdateIntValue(int: number): UpdateResource<UpdateValue> {
    const updateIntVal = new UpdateIntValue();

    updateIntVal.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/dJ1ES8QTQNepFKF5-EAqdg';
    updateIntVal.int = int;

    const updateResource: UpdateResource<UpdateValue> = new UpdateResource<UpdateValue>();

    updateResource.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
    updateResource.type = 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing';
    updateResource.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger';
    updateResource.value = updateIntVal;

    return updateResource;
  }

  updateValue(updateResource: UpdateResource<UpdateValue>) {

    this.knoraApiConnection.v2.values.updateValue(updateResource).subscribe((res: WriteValueResponse) => {
        console.log(res);
        this.valueStatus = 'OK';
      },
      error => {
        this.valueStatus = '';
      }
    );

  }

  generateCreateIntValue(int: number): UpdateResource<CreateValue> {
    const createIntVal = new CreateIntValue();
    createIntVal.int = int;

    const updateResource: UpdateResource<CreateValue> = new UpdateResource<CreateValue>();

    updateResource.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
    updateResource.type = 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing';
    updateResource.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger';
    updateResource.value = createIntVal;

    return updateResource;
  }

  createValue(updateResource: UpdateResource<CreateValue>) {

    this.knoraApiConnection.v2.values.createValue(updateResource).subscribe((res: WriteValueResponse) => {
        console.log(res);
        this.valueStatus = 'OK';
      },
      error => {
        this.valueStatus = '';
      }
    );

  }

  deleteValue() {

    const deleteVal = new DeleteValue();

    deleteVal.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw/values/bXMwnrHvQH2DMjOFrGmNzg';
    deleteVal.type = Constants.DecimalValue;

    const updateResource: UpdateResource<DeleteValue> = new UpdateResource<DeleteValue>();

    updateResource.id = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';
    updateResource.type = 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing';
    updateResource.property = 'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal';
    updateResource.value = deleteVal;

    this.knoraApiConnection.v2.values.deleteValue(updateResource).subscribe((res: DeleteValueResponse) => {
        console.log(res);
        this.valueStatus = 'OK';
      },
      error => {
        this.valueStatus = '';
      }
    );
  }

  getValue(resourceIri: string, valueUuid: string) {

    this.knoraApiConnection.v2.values.getValue(resourceIri, valueUuid).subscribe(
      (res: ReadResource) => {
        console.log(res);
        this.valueStatus = 'OK';
      },
      error => {
        this.valueStatus = '';
      }
    );

  }

}
