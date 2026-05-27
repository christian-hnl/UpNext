import {Component, inject, input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Search} from "../search/search";
import {SupabaseService} from "../../../services/supabase-service";

@Component({
  selector: 'app-join',
  imports: [
  ],
  templateUrl: './join.html',
  styleUrl: './join.scss',
})
export class Join {

  private route = inject(ActivatedRoute);
  sessionId = this.route.snapshot.paramMap.get('id');



}
