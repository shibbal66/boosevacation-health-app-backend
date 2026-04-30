import { Injectable } from "@nestjs/common";
import quotesTable, { type Quote } from "models/quotes";
import { DatabaseService } from "modules/database/database.service";

@Injectable()
export class QuoteSeedService {
  constructor(private readonly databaseService: DatabaseService) {}

  async seed(): Promise<void> {
    const quotes: Omit<Quote, "id">[] = [
      { day: 1, quote: "Start now." },
      { day: 2, quote: "Stay consistent." },
      { day: 3, quote: "Progress over perfection." },
      { day: 4, quote: "Discipline wins." },
      { day: 5, quote: "Small steps matter." },
      { day: 6, quote: "Keep showing up." },
      { day: 7, quote: "Focus beats talent." },
      { day: 8, quote: "Do it anyway." },
      { day: 9, quote: "One day at a time." },
      { day: 10, quote: "Effort compounds." },

      { day: 11, quote: "Learn daily." },
      { day: 12, quote: "Stay hungry." },
      { day: 13, quote: "Think bigger." },
      { day: 14, quote: "Act with purpose." },
      { day: 15, quote: "Fail forward." },
      { day: 16, quote: "Be relentless." },
      { day: 17, quote: "Trust the process." },
      { day: 18, quote: "Stay patient." },
      { day: 19, quote: "Build habits." },
      { day: 20, quote: "Push limits." },

      { day: 21, quote: "Believe yourself." },
      { day: 22, quote: "Stay sharp." },
      { day: 23, quote: "Consistency wins." },
      { day: 24, quote: "Execute daily." },
      { day: 25, quote: "Ignore noise." },
      { day: 26, quote: "Be focused." },
      { day: 27, quote: "Work smart." },
      { day: 28, quote: "Stay driven." },
      { day: 29, quote: "Keep learning." },
      { day: 30, quote: "Improve daily." },

      { day: 31, quote: "Stay humble." },
      { day: 32, quote: "Own your path." },
      { day: 33, quote: "Think long-term." },
      { day: 34, quote: "Stay curious." },
      { day: 35, quote: "Be adaptable." },
      { day: 36, quote: "Keep building." },
      { day: 37, quote: "Start small." },
      { day: 38, quote: "Move forward." },
      { day: 39, quote: "Stay consistent." },
      { day: 40, quote: "Chase growth." },

      { day: 41, quote: "Win the day." },
      { day: 42, quote: "Stay committed." },
      { day: 43, quote: "Think clearly." },
      { day: 44, quote: "Be fearless." },
      { day: 45, quote: "Work harder." },
      { day: 46, quote: "Keep pushing." },
      { day: 47, quote: "Stay disciplined." },
      { day: 48, quote: "Trust yourself." },
      { day: 49, quote: "Take action." },
      { day: 50, quote: "Stay focused." },

      { day: 51, quote: "Own your work." },
      { day: 52, quote: "Stay resilient." },
      { day: 53, quote: "Never settle." },
      { day: 54, quote: "Stay positive." },
      { day: 55, quote: "Keep moving." },
      { day: 56, quote: "Be consistent." },
      { day: 57, quote: "Take risks." },
      { day: 58, quote: "Stay hungry." },
      { day: 59, quote: "Keep learning." },
      { day: 60, quote: "Stay driven." },

      { day: 61, quote: "Act boldly." },
      { day: 62, quote: "Think clearly." },
      { day: 63, quote: "Stay sharp." },
      { day: 64, quote: "Do the work." },
      { day: 65, quote: "Stay committed." },
      { day: 66, quote: "Grow daily." },
      { day: 67, quote: "Stay focused." },
      { day: 68, quote: "Be patient." },
      { day: 69, quote: "Keep improving." },
      { day: 70, quote: "Work daily." },

      { day: 71, quote: "Stay strong." },
      { day: 72, quote: "Stay curious." },
      { day: 73, quote: "Act now." },
      { day: 74, quote: "Be persistent." },
      { day: 75, quote: "Stay grounded." },
      { day: 76, quote: "Keep building." },
      { day: 77, quote: "Think bigger." },
      { day: 78, quote: "Stay ready." },
      { day: 79, quote: "Keep going." },
      { day: 80, quote: "Stay focused." },

      { day: 81, quote: "Stay disciplined." },
      { day: 82, quote: "Be consistent." },
      { day: 83, quote: "Stay motivated." },
      { day: 84, quote: "Push forward." },
      { day: 85, quote: "Stay sharp." },
      { day: 86, quote: "Keep learning." },
      { day: 87, quote: "Stay resilient." },
      { day: 88, quote: "Stay driven." },
      { day: 89, quote: "Keep pushing." },
      { day: 90, quote: "Never quit." }
    ];

    try {
      await this.databaseService.db.insert(quotesTable).values(quotes);
    } catch (error) {
      console.error("Error seeding quotes:", error);
      throw error;
    }
  }
}
