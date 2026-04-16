import { Injectable } from "@nestjs/common";
import videosTable, { type Video } from "models/videos";
import { DatabaseService } from "modules/database/database.service";

@Injectable()
export class VideoSeedService {
  constructor(private readonly databaseService: DatabaseService) {}

  async seed(): Promise<void> {
    const videos: Omit<Video, "id" | "createdAt">[] = [
      {
        title: "Trump in Pakistan Next? | What Message COAS Conveyed to Iran? | Syed Muzammil Official",
        videoURL: "https://www.youtube.com/watch?v=O_Sh4TnlBOo",
        description:
          "Strategic momentum builds as Field Marshal Asim Munir's visit to Tehran marks a new chapter in regional diplomacy. With insider reports pointing toward a second round of high-level talks on Pakistani soil, Islamabad is no longer just a participant—it is the central mediator. We dive deep into why Pakistan has become the indispensable venue for global de-escalation",
        type: "ORIENTATION",
        week: 1,
        time: 23
      },
      {
        title: "Can you steal $10,000 from a locked iPhone?",
        videoURL: "https://www.youtube.com/watch?v=PPJ6NJkmDAo",
        description:
          "How we hacked MKBHD! Sponsored by Incogni - Use code veritasium at https://incogni.com/veritasium to get an exclusive 60% off.",
        type: "ORIENTATION",
        week: 2,
        time: 26
      },
      {
        title: "How Private Equity Turns Your Favorite Channels Into Slop",
        videoURL: "https://www.youtube.com/watch?v=ZoibAbdQf58",
        description: "How Private Equity Turns Your Favorite Channels Into Slop",
        type: "ORIENTATION",
        week: 3,
        time: 22
      },
      {
        title: "Trump Lashes Out at the Pope AGAIN, Posts an A.I. Jesus Pic AGAIN & Distracts from Iran AGAIN!",
        videoURL: "https://www.youtube.com/watch?v=EPqPLWMLMJ0",
        description:
          "Today is Tax Day and once again Trump has not released his tax returns, Trump is lashing out at the Pope again for being anti-war, he posted another A.I. photo of Jesus, we are now on day three of HormuzaPalooza, Trump sat for a doozy of an interview with Maria Bartiromo where he seemed desperate to change the narrative to anything other than the war in Iran, former Attorney General Pam Bondi could be held in contempt for failing to testify in front of the House Oversight Committee yesterday, JD Vance has had a rough week of failing to make deals and trying to convince us his boss wasn't a close friend of Jeffrey Epstein, a top U.S. Fema official named Gregg Phillips claims to have teleported to a Waffle House, and protestors are fighting ICE with rubber sex toys.",
        type: "BLOG",
        week: null,
        time: 17
      },
      {
        title: "Americans Can't Afford 7-Eleven | A Day Beyond Trump | JD Vance: The Pope Should Be Careful",
        videoURL: "https://www.youtube.com/watch?v=DIgJsHoctbk",
        description:
          "The war against Iran is making America's affordability crisis worse, Stephen imagines a future beyond President Trump, and VP Vance sounds ridiculous criticizing the Pope.",
        type: "BLOG",
        week: null,
        time: 12
      }
    ];

    try {
      await this.databaseService.db.insert(videosTable).values(videos);
    } catch (error) {
      console.error("Error seeding videos:", error);
      throw error;
    }
  }
}
