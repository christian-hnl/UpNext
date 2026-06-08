import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { SetName } from "./set-name";
import { SupabaseService } from "../../../services/supabase-service";
import { createSupabaseMock } from "../../../testing/test-helpers";

describe("SetName", () => {
  let component: SetName;
  let fixture: ComponentFixture<SetName>;
  let supabase: ReturnType<typeof createSupabaseMock>;

  beforeEach(async () => {
    supabase = createSupabaseMock();

    await TestBed.configureTestingModule({
      imports: [SetName],
      providers: [
        provideRouter([{ path: "**", children: [] }]),
        { provide: SupabaseService, useValue: supabase },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SetName);
    fixture.componentRef.setInput("sessionId", 123456);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => localStorage.clear());

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("creates the user when joining", async () => {
    component.userName.set("Bob");
    await component.createUserAndJoinSession();
    expect(supabase.addUser).toHaveBeenCalledWith("Bob", 123456, false);
  });
});
