import { Injectable } from "@nestjs/common";
import quotesTable, { type Quote } from "models/quotes";
import { DatabaseService } from "modules/database/database.service";

@Injectable()
export class QuoteSeedService {
  constructor(private readonly databaseService: DatabaseService) {}

  async seed(): Promise<void> {
    const quotes: Omit<Quote, "id">[] = [
      { day: 1, quote: "The beatings will continue until morale improves." },
      { day: 2, quote: "A smooth sea never made a skilled sailor." },
      { day: 3, quote: "Not all who wander are lost. Some are just on vacation." },
      { day: 4, quote: "The ocean doesn't care about your excuses. Neither does your liver." },
      { day: 5, quote: "Any fool can steer a ship in calm waters." },
      { day: 6, quote: "A hangover is your body sending you a strongly worded letter." },
      { day: 7, quote: "What are you drinking for? You're already confused enough." },
      { day: 8, quote: "Take care of yourself. We'd hate to lose you. Well, most of us." },
      { day: 9, quote: "The rum is gone. The adventure isn't." },
      { day: 10, quote: "A ship in harbor is safe — but that's not what ships for." },
      { day: 11, quote: "The wind doesn't ask permission. Neither should you." },
      { day: 12, quote: "A sailor who blames the wind never adjusts his sails." },
      { day: 13, quote: "Dead in the water is not a life strategy." },
      { day: 14, quote: "A two-day hangover isn't a warning. It's a resignation letter." },
      { day: 15, quote: "Chart your course or someone else will chart it for you." },
      { day: 16, quote: "The sea respects a man who shows up ready." },
      { day: 17, quote: "Rough seas make for great stories." },
      { day: 18, quote: "You can't cross the ocean by standing on the shore." },
      { day: 19, quote: "There are no shortcuts to open water." },
      { day: 20, quote: "Row harder. The island isn't coming to you." },
      { day: 21, quote: "A man without a plan is just drifting." },
      { day: 22, quote: "Anchors aren't just for boats." },
      { day: 23, quote: "Every great voyage starts with casting off the lines." },
      { day: 24, quote: "The horizon doesn't move. You do." },
      {
        day: 25,
        quote:
          "I feel sorry for people who don't drink. When they wake up in the morning, that's as good as they're going to feel all day."
      },
      { day: 26, quote: "Always do sober what you said you'd do drunk. That will teach you to keep your mouth shut." },
      { day: 27, quote: "I drink to make other people more interesting." },
      { day: 28, quote: "I never drink before noon. And I never drink after noon." },
      { day: 29, quote: "You're not drunk if you can lie on the floor without holding on." },
      {
        day: 30,
        quote: "I told my doctor I only drink to steady my nerves. He said I had the steadiest nerves he'd ever seen."
      },
      { day: 31, quote: "I never trust a man that doesn't drink." },
      { day: 32, quote: "My doctor told me to watch my drinking. Now I do it in front of a mirror." },
      { day: 33, quote: "I asked the bartender for something cold and full of rum. He handed me my ex-wife." },
      { day: 34, quote: "I got so drunk last night I woke up with a New Year's resolution in March." },
      { day: 35, quote: "My liver called. It said to tell you it's thinking about retiring." },
      { day: 36, quote: "The only time I say no to a drink is when I've already got one." },
      { day: 37, quote: "I don't have a drinking problem. I drink, I get drunk, I fall down. No problem." },
      { day: 38, quote: "You don't have to be perfect. You just have to play." },
      { day: 39, quote: "The break isn't the hard part. The hard part is deciding to take one." },
      { day: 40, quote: "Sleep is the fancy investment property. Let it work while you don't." },
      { day: 41, quote: "This isn't sobriety. This is strategy." },
      { day: 42, quote: "The goal isn't to never drink again." },
      { day: 43, quote: "Biology doesn't care how tough you are. Sleep harder." },
      { day: 44, quote: "Your hormones want to work for you. Give them a fighting chance." },
      { day: 45, quote: "You're not broken. You're just running an outdated operating system." },
      { day: 46, quote: "A small break can fix a big problem. That's not weakness. That's wisdom." },
      { day: 47, quote: "The man who controls his habits controls his outcomes." },
      { day: 48, quote: "You'll drink less after this. And you'll mean it more." },
      { day: 49, quote: "This is the performance protocol nobody told you about." },
      { day: 50, quote: "Real men optimize. Start here." },
      { day: 51, quote: "Every great comeback has a quiet chapter. This is yours." },
      { day: 52, quote: "The vacation isn't a pause. It's the upgrade." },
      { day: 53, quote: "The body keeps score. Time to change the scoreboard." },
      { day: 54, quote: "You've been grinding. Let your body catch up." },
      { day: 55, quote: "Your future self is going to think present you is a genius." },
      { day: 56, quote: "It's not about drinking less. It's about living more." },
      { day: 57, quote: "You're not on the wagon. You're on a yacht." },
      { day: 58, quote: "Good sleep is the cheat code you've been ignoring." },
      { day: 59, quote: "This isn't about willpower. It's about information." },
      { day: 60, quote: "The beast doesn't wake up by accident." },
      { day: 61, quote: "Master of the sea starts with mastering the night." },
      { day: 62, quote: "You don't need to earn a drink. You need to earn your sleep." },
      { day: 63, quote: "Play the game. The game will play back." },
      { day: 64, quote: "The reset is the secret weapon of every high performer." },
      { day: 65, quote: "One good night of sleep is worth three trips to the gym." },
      { day: 66, quote: "Hangover-free mornings are a superpower. Claim yours." },
      { day: 67, quote: "You can't sail at full speed with an anchor dragging." },
      { day: 68, quote: "The ocean rewards the prepared." },
      { day: 69, quote: "You're not missing out. You're loading up." },
      { day: 70, quote: "Every refreshed morning is a head start." },
      { day: 71, quote: "Less noise. More signal. Better life." },
      { day: 72, quote: "The body heals fast when you let it." },
      { day: 73, quote: "Progress over perfect. Every single time." },
      { day: 74, quote: "Small ships stay close to shore. Go bigger." },
      { day: 75, quote: "The island is real. Keep rowing." },
      { day: 76, quote: "One degree of change holds the course." },
      { day: 77, quote: "You're building something. Don't burn it down at 5pm." },
      { day: 78, quote: "The captain sets the standard. Set yours." },
      { day: 79, quote: "Light at the end of the tunnel? That's sunrise, captain." },
      { day: 80, quote: "Ships don't sail themselves. Neither does your health." },
      { day: 81, quote: "Alcohol didn't lie to you. It just didn't tell you everything." },
      { day: 82, quote: "You already know. Now you do something." },
      { day: 83, quote: "Clarity is the most underrated competitive advantage." },
      { day: 84, quote: "The vacation ends. The results don't." },
      { day: 85, quote: "Sometimes you have to fake it until you make it!" },
      { day: 86, quote: "Men don't drift. Men navigate." },
      { day: 87, quote: "The game doesn't care if you're ready. Play anyway." },
      { day: 88, quote: "The captain always adjusts the sails." },
      { day: 89, quote: "Stay the course. The horizon is near." },
      { day: 90, quote: "The voyage is the reward." }
    ];

    try {
      await this.databaseService.db.insert(quotesTable).values(quotes);
    } catch (error) {
      console.error("Error seeding quotes:", error);
      throw error;
    }
  }
}
