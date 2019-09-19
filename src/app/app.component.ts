import {Component, OnInit} from '@angular/core';
import {
  ApiResponseData,
  KnoraApiConfig,
  KnoraApiConnection,
  ListNodeCache,
  LoginResponse,
  OntologyCache,
  UserCache
} from '@knora/api';
import {UsersResponse} from '@knora/api/src/models/admin/users-response';
import {ReadResource} from '@knora/api/src/models/v2/resources/read-resource';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  knoraApiConnection: KnoraApiConnection;

  userCache: UserCache;
  ontologyCache: OntologyCache;
  listNodeCache: ListNodeCache;

  resource: ReadResource;

  ngOnInit() {
    const config = new KnoraApiConfig('http', '0.0.0.0', 3333, undefined, undefined, true);
    this.knoraApiConnection = new KnoraApiConnection(config);
    // console.log(this.knoraApiConnection);
    this.userCache = new UserCache(this.knoraApiConnection);
    this.ontologyCache = new OntologyCache(this.knoraApiConnection, config);
    this.listNodeCache = new ListNodeCache(this.knoraApiConnection);
  }

  login() {

    this.knoraApiConnection.v2.auth.login('root', 'test').subscribe(
      (loginResponse: ApiResponseData<LoginResponse>) => {
        console.log(loginResponse);
      },
      error => console.error(error)
    );

  }

  logout() {

    this.knoraApiConnection.v2.auth.logout().subscribe(
      a => console.log(a),
      b => console.error(b)
    );

  }

  getUsers() {

    this.knoraApiConnection.admin.usersEndpoint.getUsers().subscribe(
      (a: ApiResponseData<UsersResponse>) => console.log(a.body.users),
      b => console.error(b)
    );

  }

  getOntology(iri: string) {

    this.ontologyCache.getOntology(iri).subscribe(
      onto => {
        console.log('onto ', onto);
      }
    );
  }

  getResourceClass(iri: string) {

    this.ontologyCache.getResourceClassDefinition(iri).subscribe(
      onto => {
        console.log(onto);
      }
    );
  }

  getResource(iri: string) {

    this.knoraApiConnection.v2.res.getResource(iri, this.ontologyCache, this.listNodeCache).subscribe(
      (res: ReadResource) => {
        console.log(res);
        this.resource = res;

      },
      (error) => {

      }
    );

  }

  getListNode(listNodeIri: string) {

    this.listNodeCache.getNode(listNodeIri).subscribe(
      res => {
        console.log(res);
      }
    );
  }

  fulltextSearch(searchTerm: string) {

    this.knoraApiConnection.v2.search.doFulltextSearch(searchTerm, this.ontologyCache, this.listNodeCache, 0).subscribe(
      res => {
        console.log(res);
      }
    );
  }

  fulltextSearchCountQuery(searchTerm: string) {

    this.knoraApiConnection.v2.search.doFulltextSearchCountQuery(searchTerm, 0).subscribe(
      res => {
        console.log(res);
      }
    );
  }

  labelSearch(searchTerm: string) {

    this.knoraApiConnection.v2.search.doSearchByLabel(searchTerm, this.ontologyCache, this.listNodeCache, 0).subscribe(
      res => {
        console.log(res);
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

    this.knoraApiConnection.v2.search.doExtendedSearch(gravsearchQuery, this.ontologyCache, this.listNodeCache).subscribe(
      res => {
        console.log(res);
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
      res => {
        console.log(res);
      }
    );
  }



}
