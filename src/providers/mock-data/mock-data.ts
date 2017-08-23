import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable()
export class MockDataProvider implements InMemoryDbService {


  public createDb(): {} {
    throw new Error("Method not implemented.");
  }

  
}