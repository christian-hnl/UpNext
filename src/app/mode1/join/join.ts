import {Component, inject, input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {searchForGlobalZoneless} from "@angular/cli/src/commands/mcp/tools/onpush-zoneless-migration/migrate-test-file";

@Component({
  selector: 'app-join',
  imports: [],
  templateUrl: './join.html',
  styleUrl: './join.scss',
})
export class Join {

  private route = inject(ActivatedRoute);
  sessionId = this.route.snapshot.paramMap.get('id');

}
