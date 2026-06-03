import {Component, inject, input, OnInit, signal} from "@angular/core";
import {SupabaseService} from "../../../services/supabase-service";

@Component({
  selector: "app-queuevoting",
  imports: [],
  templateUrl: "./queuevoting.html",
  styleUrl: "./queuevoting.scss",
})
export class Queuevoting implements OnInit {
  sessionId = input.required<number>();
  private supabaseS = inject(SupabaseService);

  queue = signal<any[]>([]);

  async ngOnInit() {
    await this.loadQueue();
    this.setupQueueSubscription();
  }

  async loadQueue() {
    console.log('[Queuevoting] loadQueue called for sessionId:', this.sessionId());
    const { data, error } = await this.supabaseS.getQueue(this.sessionId());
    if (error) {
      console.error('[Queuevoting] Error loading queue:', error.message);
      return;
    }
    console.log('[Queuevoting] Queue loaded:', data);
    this.queue.set(data || []);
  }

  setupQueueSubscription() {
    console.log('[Queuevoting] Setting up queue subscription');
    this.supabaseS.subscribeToQueue(this.sessionId(), (payload) => {
      console.log('[Queuevoting] Queue change detected via realtime subscription. Payload:', payload);
      this.loadQueue();
    });
  }

  async upvote(queueId: number) {
    console.log('[Queuevoting] upvote called for queueId:', queueId);
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('[Queuevoting] No userId found for upvote');
      return;
    }
    await this.supabaseS.vote(queueId, userId, 1);
    // Wir laden die Queue hier auch manuell, falls Realtime mal hakt, 
    // aber eigentlich sollte subscribeToQueue das erledigen.
    await this.loadQueue();
  }

  async downvote(queueId: number) {
    console.log('[Queuevoting] downvote called for queueId:', queueId);
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('[Queuevoting] No userId found for downvote');
      return;
    }
    await this.supabaseS.vote(queueId, userId, -1);
    await this.loadQueue();
  }
}
