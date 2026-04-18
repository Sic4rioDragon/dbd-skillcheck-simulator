# Dead by Daylight Skillcheck Simulator
Dead by Daylight Skillcheck Simulator - Train your skills.

This simulator lets you practice skill checks and test killer perks, items, and add-ons that affect generator progress.

[![DBD Skillcheck Simulator](/src/assets/backgrounds/dbd-skillcheck-simulator3.png)](https://skillcheck.sic4riodragon.uk)

## Website
Play here:  
https://skillcheck.sic4riodragon.uk/

## About This Fork
This project is a fork of the original `trekkspace/dbd-skillcheck-simulator`.

The goal of this fork is simple: keep the simulator online again, improve it over time, and make it easier for people to just open and play in the browser.

## Perks
### Killer Perks

Killer perks can be activated/deactivated using **TRAINING** mode from the **GAME MODE** menu.  
In **TRAINING** mode, selected perks are active at their maximum tier or maximum tokens (**Hex: Huntress Lullaby**).

In **NORMAL** mode, killer perks have a 50% chance to activate when starting a generator, then a 10% chance to activate/deactivate during the match.

For **DECISIVE STRIKE**, all killer perks remain inactive.

- **Hex: Ruin** - **Version 2.6.0** *(before the nerf in **Version 3.5.0**)*
  - Good Skill Checks cause 3/4/5 % regression on the Generator.
  - Great Skill Checks give 0 % bonus progression on the Generator.
- **Hex: Huntress Lullaby**
  - 1 to 4 Tokens: Time between the warning sound and the Skill Check becomes shorter.
  - 5 Tokens: No Skill Check warning.
- **Unnerving Presence**
  - Triggered Skill Checks' success zones are reduced by 40/50/60 %.

### Survivor Perks
Right now, the only Survivor perk included is **DECISIVE STRIKE (DS)**, selectable from the **GAME MODE** menu.

## Toolboxes
Toolboxes can be used to repair generators more quickly. Different Toolboxes have different strengths, and Add-ons can improve speed, durability, or efficiency.

You can gain Bloodpoints by hitting Great Skill Checks multiple times, and there is also a small secret in the simulator.

### Items
- **Worn-Out Tools**
  - 80 charges
  - Moderately increases repair speed
  - Slightly decreases Skill Check success zones
- **Toolbox**
  - 130 charges
  - Moderately increases repair speed
  - Slightly decreases Skill Check success zones
- **Mechanic's Toolbox**
  - 80 charges
  - Considerably increases repair speed
- **Commodious Toolbox**
  - 180 charges
  - Moderately increases repair speed
- **Engineer’s Toolbox**
  - 80 charges
  - Tremendously increases repair speed
- **Alex’s Toolbox**
  - 130 charges
  - Slightly increases repair speed

### Add-ons
- **Spring Clamp**
  - Slightly increases repair Skill Check success zones
  - Stacks: No
- **Scraps**
  - Adds 15 charges to the Toolbox
  - Stacks: Yes
- **Clean Rag**
  - Slightly increases the Toolbox's repair speed
  - Stacks: Yes
- **Wire Spool**
  - Adds 30 charges to the Toolbox
  - Stacks: Yes
- **Socket Swivels**
  - Moderately increases Toolbox repair speed
  - Stacks: Yes
- **Protective Gloves** *(doesn't affect the generator)*
  - Stacks: Yes
- **Instructions**
  - Moderately increases the Toolbox's repair efficiency
  - Stacks: Yes
- **Grip Wrench**
  - Moderately increases repair Skill Check success zones
  - Stacks: Yes
- **Cutting Wire** *(doesn't affect the generator)*
  - Stacks: No
- **Hacksaw** *(doesn't affect the generator)*
  - Stacks: Yes

## Planned Updates
- better pause system
  - Escape to pause
  - clearer pause indication
- add **Merciless Storm**
- add a way to clear your stats
- general polish and improvements over time
- later: accounts, leaderboards, and server-side stat validation

## Local Installation
DBD Skillcheck Simulator requires [Node.js](https://nodejs.org/) to run.

Install dependencies and start the local server:

```sh
cd dbd-skillcheck-simulator
npm install
npm run serve
````

Then open **localhost:8080** in your browser.

## Contribute

Want to contribute? Great.

This project uses Javascript and VueJS. Feel free to improve it, fix bugs, or add ideas.

## Credits

Original project:

* [https://github.com/trekkspace/dbd-skillcheck-simulator](https://github.com/trekkspace/dbd-skillcheck-simulator)

Also related:

* [https://github.com/lucafont2/dbd-skillcheck-simulator](https://github.com/lucafont2/dbd-skillcheck-simulator)

## License

MIT
