export interface Lesson { id: number; slug: string; title: string; category: string; summary: string; content: string; estimatedMinutes: number; published: boolean; }
export interface Tip { id: number; lessonId: number; title: string; body: string; }
export interface QuizQuestion { prompt: string; explanation: string; options: string[]; correct: number; }
export interface Quiz { id: number; lessonId: number; title: string; description: string; questions: QuizQuestion[]; }
export interface Notice { id: number; title: string; body: string; createdAt: string; }

const L = (id: number, slug: string, category: string, title: string, summary: string, content: string, minutes: number): Lesson =>
  ({ id, slug, category, title, summary, content, estimatedMinutes: minutes, published: true });

export const seedLessons: Lesson[] = [
  L(1, "phishing-and-social-engineering", "Phishing & social engineering", "Spot phishing before it spots you",
    "Learn how urgency, impersonation, and emotional pressure are used to manipulate online decisions.",
    "Phishing messages are designed to look trustworthy while pushing you toward a risky action. Slow down when a message creates urgency, asks for a password, requests payment, or links to an unfamiliar website.\n\nCheck the sender address, inspect the destination before opening a link, and verify unusual requests through a separate trusted channel. Never share one-time codes or passwords in response to an unsolicited message. Social engineering can happen by email, phone, text, or social media, so the same pause-and-verify habit applies everywhere.", 7),
  L(2, "password-security", "Password security", "Build a stronger password habit",
    "Use unique credentials and layered protection to reduce the impact of account compromise.",
    "A strong password is long, unique, and difficult to guess. Avoid reusing the same password across important accounts because one breach can expose several services.\n\nA password manager can create and store unique passwords without requiring you to memorise each one. Turn on multi-factor authentication whenever it is available, especially for email, banking, cloud storage, and social accounts. Treat recovery codes as sensitive secrets and store them somewhere safe. If you suspect a password is exposed, change it from a trusted device and review active sessions.", 6),
  L(3, "malware-and-downloads", "Malware", "Keep malware out of your devices",
    "Recognise risky downloads and reduce the routes malicious software uses to reach your device.",
    "Malware includes software that steals information, damages files, spies on activity, or locks devices for payment. Reduce exposure by installing applications from trusted sources, keeping your operating system and browser updated, and avoiding pirated software or suspicious attachments.\n\nDo not disable security warnings simply to finish an installation. Keep important files backed up and be cautious with removable drives. If a device behaves unusually, disconnect it from the network, avoid entering more credentials, and seek support from a trusted technical professional.", 6),
  L(4, "identity-and-privacy", "Identity & privacy", "Protect your identity and privacy",
    "Understand what personal information reveals about you and how to share less of it online.",
    "Identity theft can begin with small pieces of information collected from public profiles, leaked databases, fake forms, or oversharing. Review the privacy settings on important accounts, limit the personal details visible to the public, and question why an application needs a particular permission.\n\nUse secure connections, avoid entering sensitive information on shared devices, and monitor account activity for unfamiliar changes. When a service or message asks for personal data, confirm that the request is genuine before responding.", 6),
  L(5, "safe-social-media", "Safe social media", "Make social media safer",
    "Share intentionally, recognise fake profiles, and respond safely to harassment or scams.",
    "Social-media accounts can expose your routines, relationships, location, and interests. Review who can see your posts, avoid publishing sensitive documents or real-time travel details, and be cautious when accepting unfamiliar requests.\n\nFake profiles often copy names and photographs while trying to move conversations to private channels or request money. Use reporting and blocking tools for harassment, preserve evidence when necessary, and do not retaliate against abusive accounts. Think about whether a post could create a security or privacy risk before publishing it.", 5),
  L(6, "secure-browsing", "Safe browsing", "Browse and connect with confidence",
    "Use practical habits for safer websites, public Wi-Fi, and everyday online transactions.",
    "Before entering sensitive information, check that you are on the correct website and that the connection is protected. Public Wi-Fi can be convenient but should not be treated as automatically private.\n\nAvoid sensitive transactions on unfamiliar networks and keep devices locked when unattended. Be careful with pop-ups, shortened links, fake support warnings, and offers that appear too good to be true. Log out of shared devices and remove saved payment details when they are not necessary.", 5),
  L(7, "incident-response", "Incident response", "Know what to do after a security incident",
    "Take calm, practical steps when an account, device, or personal detail may be compromised.",
    "If you suspect an account or device is compromised, act quickly but do not panic. From a trusted device, change the affected password and any reused password, enable multi-factor authentication, and review recent account activity.\n\nContact the relevant bank, service provider, school, or organisation if money or sensitive information is involved. Preserve suspicious messages and note important times or actions. Disconnect an infected device from networks while seeking technical support, and warn contacts if an attacker may have used your account to send messages.", 6),
];

export const seedTips: Tip[] = [
  { id: 1, lessonId: 1, title: "Pause before you click", body: "Urgency is a common manipulation tactic. Verify unexpected requests through a trusted channel." },
  { id: 2, lessonId: 2, title: "Use a password manager", body: "Unique passwords reduce the damage caused when one service is breached." },
  { id: 3, lessonId: 3, title: "Update promptly", body: "Security updates often fix weaknesses that attackers already know how to exploit." },
  { id: 4, lessonId: 4, title: "Share less by default", body: "Review privacy settings and avoid publishing information that reveals your routines." },
  { id: 5, lessonId: 5, title: "Verify the person, not just the profile", body: "A familiar name or photo does not prove that an account is genuine." },
  { id: 6, lessonId: 6, title: "Back up important files", body: "A separate backup gives you a safer recovery option after device loss or ransomware." },
  { id: 7, lessonId: 7, title: "Protect one-time codes", body: "Treat authentication codes as private. Support staff should not ask you to read them aloud." },
];

const Q = (id: number, lessonId: number, title: string, description: string, questions: QuizQuestion[]): Quiz =>
  ({ id, lessonId, title, description, questions });

export const seedQuizzes: Quiz[] = [
  Q(1, 1, "Phishing signals check", "Test your ability to recognise common manipulation patterns.", [
    { prompt: "Which action is safest when a message demands immediate payment?", explanation: "Urgency should prompt independent verification, not an immediate response.", options: ["Pay immediately", "Verify through a trusted channel", "Forward it to friends", "Reply with your password"], correct: 1 },
    { prompt: "What should you do with an unexpected login-code request?", explanation: "One-time codes are sensitive and should never be shared with an unsolicited requester.", options: ["Share it if the logo looks real", "Post it publicly", "Keep it private and investigate", "Send it to another stranger"], correct: 2 },
    { prompt: "Which clue can indicate a phishing website?", explanation: "A look-alike domain or unusual spelling can indicate that a site is not the genuine service.", options: ["A familiar topic", "A look-alike web address", "A short message", "A normal colour scheme"], correct: 1 },
  ]),
  Q(2, 2, "Password habits check", "Check the habits that make accounts more resilient.", [
    { prompt: "Why should important accounts have unique passwords?", explanation: "Reused passwords let one breach unlock several accounts.", options: ["They are easier to share", "They limit the impact of one breach", "They remove the need for updates", "They make phishing impossible"], correct: 1 },
    { prompt: "Which additional control should you enable when available?", explanation: "Multi-factor authentication adds another verification layer beyond the password.", options: ["Multi-factor authentication", "Public password sharing", "Password reuse", "Unknown browser extensions"], correct: 0 },
    { prompt: "What is a safe place for recovery codes?", explanation: "Recovery codes should be stored privately where unauthorised people cannot access them.", options: ["A public post", "A shared chat", "A protected private location", "A comment on a video"], correct: 2 },
  ]),
  Q(3, 3, "Malware defence check", "Identify safer device and download behaviour.", [
    { prompt: "Where should applications normally be installed from?", explanation: "Trusted sources reduce the chance of downloading tampered or malicious software.", options: ["Random pop-ups", "Trusted official sources", "Unknown file-sharing links", "Pirated bundles"], correct: 1 },
    { prompt: "What should you do with suspicious attachments?", explanation: "Unexpected attachments can deliver malware and should be verified before opening.", options: ["Open them quickly", "Verify the sender and context", "Disable security tools", "Rename them and run them"], correct: 1 },
    { prompt: "What is a useful recovery measure?", explanation: "Backups provide another way to recover important files after damage or ransomware.", options: ["Deleting updates", "Keeping separate backups", "Using one password everywhere", "Ignoring unusual activity"], correct: 1 },
  ]),
  Q(4, 4, "Privacy and identity check", "Practise making lower-risk decisions about personal information.", [
    { prompt: "What should you do when an app requests an unusual permission?", explanation: "Questioning permissions helps limit unnecessary collection of personal information.", options: ["Grant it automatically", "Question the need first", "Share more information", "Disable all device security"], correct: 1 },
    { prompt: "What is a warning sign in a data request?", explanation: "Unexpected requests for sensitive data deserve independent verification.", options: ["A clear official process", "An unexpected request for sensitive data", "A privacy notice", "A known service contact"], correct: 1 },
    { prompt: "What is a good public-profile habit?", explanation: "Limiting exposed details reduces the information available to impersonators.", options: ["Publish every routine", "Limit visible personal details", "Share recovery codes", "Post identity documents"], correct: 1 },
  ]),
  Q(5, 5, "Social-media safety check", "Test your ability to manage profiles, posts, and suspicious contacts.", [
    { prompt: "What should you do before accepting an unfamiliar request?", explanation: "A familiar name or picture does not prove that a profile is genuine.", options: ["Verify the person independently", "Send money first", "Share your location", "Give them a login code"], correct: 0 },
    { prompt: "What is an appropriate response to online harassment?", explanation: "Blocking, reporting, and preserving evidence are safer than escalating the exchange.", options: ["Retaliate publicly", "Block, report, and preserve evidence", "Share private details", "Give the account access"], correct: 1 },
    { prompt: "What should you consider before posting?", explanation: "Posts can reveal routines, locations, and sensitive context to unknown viewers.", options: ["Whether it creates a privacy risk", "Whether it includes a password", "Whether it reveals a code", "Whether it exposes a document"], correct: 0 },
  ]),
  Q(6, 6, "Safer browsing check", "Review the habits that protect everyday browsing and transactions.", [
    { prompt: "What should you check before entering sensitive information?", explanation: "Confirming the correct website helps reduce look-alike site risks.", options: ["Only the colour", "The correct website and connection", "The number of ads", "The shortest URL"], correct: 1 },
    { prompt: "How should public Wi-Fi be treated?", explanation: "Public networks are convenient but should not automatically be considered private.", options: ["As automatically private", "With caution for sensitive activity", "As a place to share passwords", "As a reason to disable updates"], correct: 1 },
    { prompt: "What should you do on a shared device?", explanation: "Logging out reduces the chance that another person can access your account.", options: ["Stay signed in", "Log out when finished", "Save every payment detail", "Leave the device unlocked"], correct: 1 },
  ]),
  Q(7, 7, "Incident response check", "Check your first steps after a possible compromise.", [
    { prompt: "What is a sensible first step after a suspected account compromise?", explanation: "Use a trusted device to change the affected password and review activity.", options: ["Ignore it", "Change the password from a trusted device", "Share the password", "Delete all evidence"], correct: 1 },
    { prompt: "What should you do if money may be involved?", explanation: "The relevant bank or service provider can help protect the account and investigate.", options: ["Wait indefinitely", "Contact the relevant provider", "Post card details", "Send another payment"], correct: 1 },
    { prompt: "What can help technical support understand an incident?", explanation: "Preserving suspicious messages and noting times can support investigation.", options: ["Deleting all messages", "Preserving evidence and key times", "Changing random settings", "Forwarding the message widely"], correct: 1 },
  ]),
];

export const seedNotices: Notice[] = [
  { id: 1, title: "Welcome to Signalwise", body: "Browse the library, complete a module, and try your first signal check quiz. Your progress is saved to your account.", createdAt: new Date().toISOString() },
  { id: 2, title: "New topics arriving soon", body: "We are expanding the library with modules on mobile security and safe online shopping.", createdAt: new Date().toISOString() },
];

export const seedContent = { lessons: seedLessons, tips: seedTips, quizzes: seedQuizzes, notices: seedNotices };