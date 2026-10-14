package com.vibematch.config;

import com.vibematch.entity.*;
import com.vibematch.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserPreferenceRepository preferenceRepository;
    private final FriendshipRepository friendshipRepository;
    private final FriendRequestRepository friendRequestRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MessageReactionRepository messageReactionRepository;
    private final CommunityRepository communityRepository;
    private final CommunityPostRepository communityPostRepository;
    private final NotificationRepository notificationRepository;
    private final ReportRepository reportRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      UserPreferenceRepository preferenceRepository,
                      FriendshipRepository friendshipRepository,
                      FriendRequestRepository friendRequestRepository,
                      ChatMessageRepository chatMessageRepository,
                      MessageReactionRepository messageReactionRepository,
                      CommunityRepository communityRepository,
                      CommunityPostRepository communityPostRepository,
                      NotificationRepository notificationRepository,
                      ReportRepository reportRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.preferenceRepository = preferenceRepository;
        this.friendshipRepository = friendshipRepository;
        this.friendRequestRepository = friendRequestRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.messageReactionRepository = messageReactionRepository;
        this.communityRepository = communityRepository;
        this.communityPostRepository = communityPostRepository;
        this.notificationRepository = notificationRepository;
        this.reportRepository = reportRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        String defaultPass = passwordEncoder.encode("password123");
        String adminPass = passwordEncoder.encode("admin123");

        // 1. Users
        User alex = new User("alex_vibe", "alex@vibematch.io", defaultPass, "Alex Rivera");
        alex.setBio("Building autonomous AI agents & cybernetic soundscapes. Seeking co-founders, late-night hackers, and synth lovers.");
        alex.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
        alex.setLocation("San Francisco, CA");
        alex.setGender("Non-Binary");
        alex.setAge(26);
        alex.setVibeArchetype("Tech Alchemist");
        alex.setIsOnline(true);
        alex.setIsVerified(true);
        alex.setRole("ROLE_USER");
        alex.setInterests(Set.of("AI Art", "Cyberpunk", "Synthwave", "Tech", "Coffee", "Open Source"));
        alex.setHobbies(Set.of("Coding", "Synthesizers", "Sci-Fi Reading"));
        alex.setLanguages(Set.of("English", "Japanese"));
        alex = userRepository.save(alex);
        preferenceRepository.save(new UserPreference(alex));

        User maya = new User("maya_cosmic", "maya@vibematch.io", defaultPass, "Maya Lin");
        maya.setBio("Visual designer, lucid dreamer, and ambient electronic producer. I curate spaces with violet light and deep sound.");
        maya.setAvatarUrl("https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80");
        maya.setLocation("Brooklyn, NY");
        maya.setGender("Female");
        maya.setAge(24);
        maya.setVibeArchetype("Cosmic Dreamer");
        maya.setIsOnline(true);
        maya.setIsVerified(true);
        maya.setRole("ROLE_USER");
        maya.setInterests(Set.of("Ambient Music", "Cyberpunk", "Generative Art", "Neon Aesthetics", "Astronomy", "Design"));
        maya.setHobbies(Set.of("Digital Art", "Photography", "Meditation"));
        maya.setLanguages(Set.of("English", "German"));
        maya = userRepository.save(maya);
        preferenceRepository.save(new UserPreference(maya));

        User jordan = new User("jordan_cyber", "jordan@vibematch.io", defaultPass, "Jordan Vance");
        jordan.setBio("Synthesizer hoarder, darkwave producer, retro gaming nerd. Always down for espresso and analog gear discussions.");
        jordan.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80");
        jordan.setLocation("Austin, TX");
        jordan.setGender("Male");
        jordan.setAge(28);
        jordan.setVibeArchetype("Synthwave Producer");
        jordan.setIsOnline(false);
        jordan.setLastSeen(LocalDateTime.now().minusMinutes(22));
        jordan.setIsVerified(true);
        jordan.setRole("ROLE_USER");
        jordan.setInterests(Set.of("Synthwave", "Retro Gaming", "Sound Design", "Analog Gear", "Coffee", "Cyberpunk"));
        jordan.setHobbies(Set.of("Music Production", "Retro Arcade", "Hiking"));
        jordan.setLanguages(Set.of("English", "Korean"));
        jordan = userRepository.save(jordan);
        preferenceRepository.save(new UserPreference(jordan));

        User chloe = new User("chloe_pulse", "chloe@vibematch.io", defaultPass, "Chloe Taylor");
        chloe.setBio("Creative technologist, generative poetry writer, and underground techno DJ. Let's talk sci-fi philosophies and neon cities.");
        chloe.setAvatarUrl("https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80");
        chloe.setLocation("London, UK");
        chloe.setGender("Female");
        chloe.setAge(25);
        chloe.setVibeArchetype("Creative Polymath");
        chloe.setIsOnline(true);
        chloe.setIsVerified(false);
        chloe.setRole("ROLE_USER");
        chloe.setInterests(Set.of("Techno", "Creative Coding", "Philosophy", "Sci-Fi", "Minimalism", "AI Art"));
        chloe.setHobbies(Set.of("DJing", "Poetry", "Bouldering"));
        chloe.setLanguages(Set.of("English", "French"));
        chloe = userRepository.save(chloe);
        preferenceRepository.save(new UserPreference(chloe));

        User liam = new User("liam_zen", "liam@vibematch.io", defaultPass, "Liam Chen");
        liam.setBio("Full-stack engineer by day, night city wanderer by night. Exploring urban acoustics and high-frequency vibes.");
        liam.setAvatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80");
        liam.setLocation("Vancouver, BC");
        liam.setGender("Male");
        liam.setAge(27);
        liam.setVibeArchetype("Night Owl Adventurer");
        liam.setIsOnline(false);
        liam.setLastSeen(LocalDateTime.now().minusHours(2));
        liam.setIsVerified(false);
        liam.setRole("ROLE_USER");
        liam.setInterests(Set.of("Tech", "Urban Exploring", "Night Cycling", "Cyberpunk", "Coffee", "Indie Games"));
        liam.setHobbies(Set.of("Cycling", "Coding", "Film Photography"));
        liam.setLanguages(Set.of("English", "Mandarin"));
        liam = userRepository.save(liam);
        preferenceRepository.save(new UserPreference(liam));

        User admin = new User("admin", "admin@vibematch.io", adminPass, "Admin Moderator");
        admin.setBio("VibeMatch platform operations, trust, safety, and community moderation.");
        admin.setAvatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80");
        admin.setLocation("Cyberspace");
        admin.setRole("ROLE_ADMIN");
        admin.setIsVerified(true);
        admin.setIsOnline(true);
        admin = userRepository.save(admin);
        preferenceRepository.save(new UserPreference(admin));

        // 2. Friendships
        friendshipRepository.save(new Friendship(alex, maya));
        friendshipRepository.save(new Friendship(alex, jordan));

        // 3. Friend Requests
        FriendRequest reqFromChloe = new FriendRequest(chloe, alex);
        friendRequestRepository.save(reqFromChloe);

        FriendRequest reqToLiam = new FriendRequest(alex, liam);
        friendRequestRepository.save(reqToLiam);

        // 4. Chat Messages between Alex & Maya
        ChatMessage m1 = new ChatMessage(maya.getId(), alex.getId(), "Hey Alex! Just checked out your new generative music model on GitHub. The harmonic flow is mesmerizing 🔮", ChatMessage.MessageType.TEXT);
        m1.setIsRead(true);
        m1.setReadAt(LocalDateTime.now().minusMinutes(45));
        m1.setCreatedAt(LocalDateTime.now().minusMinutes(50));
        m1 = chatMessageRepository.save(m1);

        ChatMessage m2 = new ChatMessage(alex.getId(), maya.getId(), "Thank you Maya!! I trained it on vintage Prophet-6 and Moog stems. Glad the vibe resonated with you ✨", ChatMessage.MessageType.TEXT);
        m2.setIsRead(true);
        m2.setReadAt(LocalDateTime.now().minusMinutes(35));
        m2.setCreatedAt(LocalDateTime.now().minusMinutes(40));
        m2 = chatMessageRepository.save(m2);

        ChatMessage m3 = new ChatMessage(maya.getId(), alex.getId(), "Check out this 15-second ambient sub-bass clip I layered into my new track tonight!", ChatMessage.MessageType.VOICE);
        m3.setMediaUrl("https://actions.google.com/sounds/v1/science_fiction/alien_hum.ogg");
        m3.setMediaMeta("0:15");
        m3.setIsRead(true);
        m3.setReadAt(LocalDateTime.now().minusMinutes(10));
        m3.setCreatedAt(LocalDateTime.now().minusMinutes(15));
        m3 = chatMessageRepository.save(m3);

        ChatMessage m4 = new ChatMessage(alex.getId(), maya.getId(), "Whoa that sub-bass texture gives intense Blade Runner 2049 vibes! Let's do a quick audio call later to jam?", ChatMessage.MessageType.TEXT);
        m4.setIsRead(false);
        m4.setCreatedAt(LocalDateTime.now().minusMinutes(2));
        m4 = chatMessageRepository.save(m4);

        // Reactions
        messageReactionRepository.save(new MessageReaction(m1.getId(), alex.getId(), "💜"));
        messageReactionRepository.save(new MessageReaction(m2.getId(), maya.getId(), "🔥"));
        messageReactionRepository.save(new MessageReaction(m3.getId(), alex.getId(), "✨"));

        // Chat with Jordan
        ChatMessage j1 = new ChatMessage(jordan.getId(), alex.getId(), "Alex, did you see the new firmware update for the synth? Huge improvements to MIDI sync.", ChatMessage.MessageType.TEXT);
        j1.setIsRead(true);
        j1.setCreatedAt(LocalDateTime.now().minusHours(3));
        chatMessageRepository.save(j1);

        // 5. Communities
        Community c1 = new Community("Neon Cyberpunks & Synth Heads", "Where analog retro synth lovers, darkwave producers, and cyberpunk aesthetics unite.", "⚡", "Music & Audio");
        c1.setBanner("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80");
        c1.addMember(alex.getId());
        c1.addMember(maya.getId());
        c1.addMember(jordan.getId());
        c1 = communityRepository.save(c1);

        Community c2 = new Community("AI Builders & Neural Hackers", "Discussing autonomous agents, neural architectures, and generative synthetic worlds.", "🧠", "Tech & AI");
        c2.setBanner("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80");
        c2.addMember(alex.getId());
        c2.addMember(chloe.getId());
        c2 = communityRepository.save(c2);

        Community c3 = new Community("Cosmic Dreamers & Philosophers", "Late-night existential talks, lucid dreaming, ambient frequencies, and speculative fiction.", "✨", "Creatives & Writers");
        c3.setBanner("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80");
        c3.addMember(maya.getId());
        c3.addMember(chloe.getId());
        c3 = communityRepository.save(c3);

        Community c4 = new Community("Midnight Gamers & Pixel Artists", "Lo-fi vibes, competitive tactical shooters, indie gems, and pixel art showcases.", "👾", "Gaming & Esports");
        c4.setBanner("https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80");
        c4.addMember(jordan.getId());
        c4.addMember(liam.getId());
        c4 = communityRepository.save(c4);

        // Community Posts
        communityPostRepository.save(new CommunityPost(
                c1.getId(),
                jordan.getId(),
                jordan.getFullName(),
                jordan.getAvatarUrl(),
                "Just finished patching an 8-layer arpeggio with the Juno-106 clone. Who else here prefers analog warmth over digital crispness? 🎛️"
        ));

        communityPostRepository.save(new CommunityPost(
                c2.getId(),
                alex.getId(),
                alex.getFullName(),
                alex.getAvatarUrl(),
                "Exploring multi-agent consensus algorithms for decentralized social graphs. The convergence properties are looking super promising!"
        ));

        // 6. Notifications for Alex
        notificationRepository.save(new Notification(
                alex.getId(),
                maya.getId(),
                maya.getFullName(),
                maya.getAvatarUrl(),
                Notification.Type.VIBE_MATCH,
                "94% Frequency Synergy ✨",
                "You and Maya Lin hit 94% harmonic compatibility on shared Cyberpunk & Synthwave vibes!",
                maya.getId().toString()
        ));

        notificationRepository.save(new Notification(
                alex.getId(),
                chloe.getId(),
                chloe.getFullName(),
                chloe.getAvatarUrl(),
                Notification.Type.FRIEND_REQUEST,
                "New Friend Request",
                chloe.getFullName() + " wants to connect with you on VibeMatch.",
                reqFromChloe.getId().toString()
        ));

        // 7. Admin Report sample
        reportRepository.save(new Report(
                jordan,
                liam,
                "Spam / Excessive Self-Promotion",
                "User was repeatedly posting promotional Discord invite links in the music feed."
        ));
    }
}
