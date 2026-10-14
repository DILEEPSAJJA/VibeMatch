package com.vibematch.config;

import com.vibematch.entity.*;
import com.vibematch.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final UserPreferenceRepository preferenceRepository;
    private final CommunityRepository communityRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      UserPreferenceRepository preferenceRepository,
                      CommunityRepository communityRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.preferenceRepository = preferenceRepository;
        this.communityRepository = communityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Clean up legacy mock demo profiles if present
        List<String> legacyDemoUsers = List.of("alex_vibe", "maya_cosmic", "jordan_cyber", "chloe_pulse", "liam_zen");
        for (String uname : legacyDemoUsers) {
            Optional<User> demoUser = userRepository.findByUsername(uname);
            demoUser.ifPresent(userRepository::delete);
        }

        // Ensure default system administrator exists for moderation
        if (userRepository.findByUsername("admin").isEmpty()) {
            String adminPass = passwordEncoder.encode("admin123");
            User admin = new User("admin", "admin@vibematch.io", adminPass, "Admin Moderator");
            admin.setBio("VibeMatch platform operations, trust, safety, and community moderation.");
            admin.setAvatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80");
            admin.setLocation("Cyberspace");
            admin.setIsOnline(true);
            admin.setIsVerified(true);
            admin.setRole("ROLE_ADMIN");
            admin = userRepository.save(admin);
            preferenceRepository.save(new UserPreference(admin));
        }

        // Ensure real primary user Deepu exists on cloud/dev instances
        if (userRepository.findByUsername("Deepu").isEmpty()) {
            String pass = passwordEncoder.encode("123456");
            User deepu = new User("Deepu", "dileep@gmail.com", pass, "Dileep");
            deepu.setLocation("Hyderabad");
            deepu.setGender("Male");
            deepu.setAge(22);
            deepu.setVibeArchetype("Tech Alchemist");
            deepu.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
            deepu.setIsOnline(true);
            deepu.setRole("ROLE_USER");
            deepu.setInterests(new java.util.HashSet<>(List.of("Photography", "Tech", "AI Art", "Gaming")));
            deepu.setHobbies(new java.util.HashSet<>(List.of("Coding", "Music Production")));
            deepu.setLanguages(new java.util.HashSet<>(List.of("English")));
            deepu = userRepository.save(deepu);
            preferenceRepository.save(new UserPreference(deepu));
        }

        // Ensure real primary user deekshi exists on cloud/dev instances
        if (userRepository.findByUsername("deekshi").isEmpty()) {
            String pass = passwordEncoder.encode("123456");
            User deekshi = new User("deekshi", "deek@gmail.com", pass, "Deekshitha");
            deekshi.setLocation("Hyderabad");
            deekshi.setGender("Female");
            deekshi.setAge(22);
            deekshi.setVibeArchetype("Tech Alchemist");
            deekshi.setAvatarUrl("https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80");
            deekshi.setIsOnline(true);
            deekshi.setRole("ROLE_USER");
            deekshi.setInterests(new java.util.HashSet<>(List.of("Photography", "Design", "Tech", "Synthwave", "Gaming")));
            deekshi.setHobbies(new java.util.HashSet<>(List.of("Coding", "Music Production")));
            deekshi.setLanguages(new java.util.HashSet<>(List.of("English")));
            deekshi = userRepository.save(deekshi);
            preferenceRepository.save(new UserPreference(deekshi));
        }

        // Initialize default communities if empty (without fake members/posts)
        if (communityRepository.count() == 0) {
            Community c1 = new Community(
                "Neon Cyberpunks & Synth Heads",
                "Where analog retro synth lovers, darkwave producers, and cyberpunk aesthetics unite.",
                "⚡",
                "Music & Audio"
            );
            c1.setBanner("https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80");

            Community c2 = new Community(
                "AI Builders & Neural Hackers",
                "Discussing autonomous agents, neural architectures, and generative synthetic worlds.",
                "🧠",
                "Tech & AI"
            );
            c2.setBanner("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80");

            Community c3 = new Community(
                "Cosmic Dreamers & Philosophers",
                "Late-night existential talks, lucid dreaming, ambient frequencies, and speculative fiction.",
                "✨",
                "Creatives & Writers"
            );
            c3.setBanner("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80");

            Community c4 = new Community(
                "Midnight Gamers & Pixel Artists",
                "Lo-fi vibes, competitive tactical shooters, indie gems, and pixel art showcases.",
                "👾",
                "Gaming & Esports"
            );
            c4.setBanner("https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80");

            communityRepository.saveAll(List.of(c1, c2, c3, c4));
        }
    }
}
