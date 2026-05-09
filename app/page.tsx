"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowRightIcon,
  BackpackIcon,
  CheckIcon,
  CodeIcon,
  CopyIcon,
  DashboardIcon,
  DiscordLogoIcon,
  EnvelopeClosedIcon,
  ExternalLinkIcon,
  GearIcon,
  GitHubLogoIcon,
  GlobeIcon,
  LinkedInLogoIcon,
  LightningBoltIcon,
  MoonIcon,
  PersonIcon,
  ReaderIcon,
  RocketIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { motion } from "motion/react";

type Theme = "light" | "dark";

const email = "trarimehdi59@gmail.com";
const githubUrl = "https://github.com/MehdiTrari";
const linkedinUrl = "https://www.linkedin.com/in/mehdi-trari/";

const skillGroups = [
  {
    title: "Back-end",
    icon: CodeIcon,
    items: ["PHP", "Symfony", "Doctrine ORM", ".NET 9", "Minimal API", "API REST"],
  },
  {
    title: "Front-end",
    icon: DashboardIcon,
    items: ["Angular", "TypeScript", "JavaScript", "Twig", "Blazor", "TailwindCSS"],
  },
  {
    title: "Tests & qualité",
    icon: GearIcon,
    items: ["Panther", "Playwright", "xUnit", "PHPUnit", "tests E2E", "maintenance évolutive"],
  },
  {
    title: "DevOps",
    icon: RocketIcon,
    items: ["Docker", "GitHub Actions", "GitLab CI/CD", "Kubernetes", "Linux", "Bash"],
  },
  {
    title: "Cyber",
    icon: LightningBoltIcon,
    items: ["Master Cyber", "AppSec", "CTF", "OWASP", "contrôle d'accès", "sécurité API"],
  },
  {
    title: "Projet",
    icon: ReaderIcon,
    items: ["Jira", "méthodes agiles", "releases", "applications métier", "travail d'équipe"],
  },
];

const projects = [
  {
    title: "Nexus Dashboard",
    type: "League of Legends",
    icon: DashboardIcon,
    text: "Application web distribuée en .NET Aspire pour consulter un wiki de champions, analyser un compte joueur via l'API Riot Games et gérer des astuces communautaires.",
    stack: [".NET 9", "Aspire", "Blazor", "SQL Server","Riot Games API", "Keycloak", "Docker"],
    links: [{ href: "https://github.com/MehdiTrari/LoLProject", type: "repo" }],
  },
  {
    title: "CSO SoloQ Leaderboard Bot",
    type: "Bot Discord",
    icon: DiscordLogoIcon,
    text: "Bot Discord qui suit automatiquement le classement Solo/Duo des membres d'un serveur, avec leaderboard, commandes slash et panel interactif.",
    stack: ["Node.js", "JavaScript", "Discord.js", "Riot Games API"],
    links: [{ href: "https://github.com/MehdiTrari/BotDiscordCSO", type: "repo" }],
  },
  {
    title: "Roaming Lille",
    type: "Plateforme client",
    icon: GlobeIcon,
    text: "Site professionnel mis en production pour une activité de location saisonnière à Lille, avec catalogue, recherche avancée, multilingue et formulaire de contact.",
    stack: ["PHP 8", "Symfony 8", "PostgreSQL", "Twig", "Bootstrap", "Docker", "GitHub Actions"],
    links: [{ href: "https://roaminglille.com/", type: "site" }],
  },
  {
    title: "Pizzeria O'Trari",
    type: "Site vitrine",
    icon: BackpackIcon,
    text: "Site vitrine Symfony pour présenter une pizzeria et son catalogue, avec une structure MVC propre et une base évolutive.",
    stack: ["PHP 8", "Symfony 6", "Doctrine", "Twig", "Stimulus", "Docker Compose", "GitHub Actions"],
    links: [
      { href: "https://otraripizza.me/", type: "site" },
      { href: "https://github.com/MehdiTrari/PizzeriaSite", type: "repo" },
    ],
  },
];

const values = [
  {
    title: "Applications métier",
    text: "Expérience sur des intranets, outils de gestion, fonctionnalités back-end et maintenance de code existant.",
  },
  {
    title: "Back-end solide",
    text: "Orientation PHP/Symfony claire, avec une capacité à intervenir aussi sur le front, les tests et la livraison.",
  },
  {
    title: "Culture cyber",
    text: "Sensibilité AppSec issue du Master Cyber : CTF, labs, vulnérabilités web, contrôle d'accès et bonnes pratiques OWASP.",
  },
];

const cyberTopics = [
  "CTF",
  "Airbus CyberRange",
  "Exegol",
  "VPN Linux",
  "injections",
  "XSS",
  "contrôle d'accès",
  "reconnaissance",
  "énumération de services",
  "élévation de privilèges",
  "pivot réseau",
  "segmentation réseau",
  "sécurité des API",
  "OWASP",
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme ?? (prefersDark ? "dark" : "light");

    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
    setReady(true);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
  }

  const isDark = ready && theme === "dark";

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={isDark ? "Activer le thème clair" : "Activer le thème nuit"}
      onClick={toggleTheme}
    >
      {isDark ? <SunIcon aria-hidden /> : <MoonIcon aria-hidden />}
    </button>
  );
}

function EmailAction() {
  const [copied, setCopied] = useState(false);

  async function copyEmail(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mail-action">
      <a className="mail-link" href={`mailto:${email}`}>
        <EnvelopeClosedIcon aria-hidden />
        <span>{email}</span>
      </a>
      <button className="copy-mail-button" type="button" onClick={copyEmail} aria-label="Copier l'adresse mail">
        {copied ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden />}
      </button>
    </div>
  );
}

function ContactLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "contact-links compact" : "contact-links"}>
      <EmailAction />
      <a className="icon-link" href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
        <GitHubLogoIcon aria-hidden />
      </a>
      <a className="icon-link" href={linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
        <LinkedInLogoIcon aria-hidden />
      </a>
    </div>
  );
}

function scrollToSection(event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) {
  event.preventDefault();

  const section = document.querySelector(sectionId);
  if (!section) {
    return;
  }

  const headerOffset = 88;
  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  const startTop = window.scrollY;
  const targetTop = Math.max(sectionTop - headerOffset, 0);
  const distance = targetTop - startTop;
  const duration = Math.min(Math.max(Math.abs(distance) * 0.45, 520), 900);
  const startTime = performance.now();

  function easeOutCubic(progress: number) {
    return 1 - Math.pow(1 - progress, 3);
  }

  function animateScroll(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    window.scrollTo(0, startTop + distance * easeOutCubic(progress));

    if (progress < 1) {
      window.requestAnimationFrame(animateScroll);
    }
  }

  window.requestAnimationFrame(animateScroll);
}

export default function Home() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY < 24 || delta < 0) {
        setIsHeaderVisible(true);
      } else if (delta > 6) {
        setIsHeaderVisible(false);
      }

      lastScrollY = currentScrollY;
    }

    function handleWheel(event: WheelEvent) {
      if (event.deltaY < 0) {
        setIsHeaderVisible(true);
      } else if (event.deltaY > 0 && window.scrollY > 80) {
        setIsHeaderVisible(false);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <main>
      <header className={isHeaderVisible ? "site-header" : "site-header is-hidden"}>
        <a className="brand" href="#top" aria-label="Retour en haut">
          <span>Mehdi Trari</span>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#profil" onClick={(event) => scrollToSection(event, "#profil")}>
            Profil
          </a>
          <a href="#competences" onClick={(event) => scrollToSection(event, "#competences")}>
            Compétences
          </a>
          <a href="#projets" onClick={(event) => scrollToSection(event, "#projets")}>
            Projets
          </a>
          <a href="#contact" onClick={(event) => scrollToSection(event, "#contact")}>
            Contact
          </a>
        </nav>
        <div className="header-actions">
          <ContactLinks compact />
          <ThemeToggle />
        </div>
      </header>

      <section id="top" className="hero">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.34, ease: "easeOut" }}
        >
          <p className="eyebrow">
            Développeur full-stack
          </p>
          <h1>Orienté back-end PHP/Symfony, avec une sensibilité AppSec.</h1>
          <p className="hero-text">
            Alternant confirmé et développeur junior avancé, je construis des applications web
            métier avec une base back-end solide, une vraie sensibilité qualité et une culture
            cybersécurité issue de mon Master Cyber.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#projets">
              Voir mes projets <ArrowRightIcon aria-hidden />
            </a>
            <a className="button ghost" href={`mailto:${email}`}>
              Me contacter
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.96, rotate: -1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.42, delay: 0.08, ease: "easeOut" }}
          aria-label="Synthèse visuelle du profil"
        >
          <div className="visual-topline">
            <span />
            <span />
            <span />
          </div>
          <div className="profile-panel">
            <div className="portrait-wrap">
              <Image
                src="/images/photo-mehdi.jpg"
                alt="Portrait de Mehdi Trari"
                className="portrait"
                fill
                priority
                sizes="(max-width: 900px) 82vw, 340px"
              />
            </div>
            <div className="profile-summary">
              <p className="profile-status">
                <PersonIcon aria-hidden /> Alternance actuelle - CNAM
              </p>
              <strong>Mehdi Trari</strong>
              <span>Développeur full-stack orienté back-end PHP/Symfony et sécurité applicative.</span>
              <div className="hero-facts">
                <div>
                  <CodeIcon aria-hidden />
                  <span>Symfony</span>
                  <small>socle principal</small>
                </div>
                <div>
                  <RocketIcon aria-hidden />
                  <span>3 ans</span>
                  <small>stage + alternance</small>
                </div>
                <div>
                  <LightningBoltIcon aria-hidden />
                  <span>AppSec</span>
                  <small>Master Cyber</small>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <motion.section
        id="profil"
        className="section split"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <div>
          <p className="section-kicker">Profil</p>
          <h2>Un profil full-stack avec un socle back-end net.</h2>
        </div>
        <div className="profile-copy">
          <p>
            Mon point fort principal est le développement applicatif web, surtout autour de
            PHP/Symfony. À la CNAM, je travaille sur des applications intranet de gestion avec
            conception back-end, maintenance corrective et évolutive.
          </p>
          <p>
            Mon expérience chez sweeek et Falk Esport renforce cette polyvalence : front-end,
            release, tests, base de données, déploiement et compréhension des besoins métier.
          </p>
        </div>
      </motion.section>

      <section id="competences" className="section">
        <div className="section-heading">
          <p className="section-kicker">Compétences</p>
          <h2>Ce que je peux apporter à une équipe technique.</h2>
        </div>
        <div className="skill-grid grouped">
          {skillGroups.map((group, index) => {
            const Icon = group.icon;
            return (
              <motion.article
                className="skill-card"
                key={group.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.22, delay: index * 0.025 }}
              >
                <div className="skill-card-title">
                  <Icon aria-hidden />
                  <h3>{group.title}</h3>
                </div>
                <div className="skill-list">
                  {group.items.map((item) => (
                    <span className="skill" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="section cyber-band">
        <motion.div
          className="cyber-layout"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <div>
            <p className="section-kicker">Cybersécurité & AppSec</p>
            <h2>Une culture cyber au service du développement.</h2>
          </div>
          <div className="cyber-copy">
            <p>
              Dans le cadre de mon Master Cyber, j'ai développé une culture cybersécurité à travers
              des CTF, des labs pratiques et des mises en situation en environnement contrôlé,
              notamment sur l'Airbus CyberRange avec Exegol et un VPN sous Linux.
            </p>
            <p>
              Je ne me positionne pas comme expert pentest, mais cette approche m'aide à mieux
              comprendre la logique d'un attaquant et à intégrer cette vision dans mes développements :
              validation des entrées, contrôle d'accès, gestion des rôles, protection des données
              sensibles, sécurisation des APIs et bonnes pratiques OWASP.
            </p>
            <div className="cyber-topics" aria-label="Notions cybersécurité abordées">
              {cyberTopics.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="projets" className="section">
        <div className="section-heading inline">
          <div>
            <p className="section-kicker">Sélection</p>
            <h2>Projets phares</h2>
          </div>
          <a className="text-link" href={githubUrl} target="_blank" rel="noreferrer">
            GitHub <ExternalLinkIcon aria-hidden />
          </a>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.article
                className="project-card"
                key={project.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.26, delay: index * 0.04 }}
              >
                <div className="project-topline">
                  <div className="project-icon">
                    <Icon aria-hidden />
                  </div>
                  <div className="project-links">
                    {project.links.map((link) => (
                      <a
                        href={link.href}
                        key={link.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${link.type === "repo" ? "Voir le repo GitHub" : "Voir le site"} ${project.title}`}
                      >
                        {link.type === "repo" ? <GitHubLogoIcon aria-hidden /> : <ExternalLinkIcon aria-hidden />}
                      </a>
                    ))}
                  </div>
                </div>
                <p>{project.type}</p>
                <h3>{project.title}</h3>
                <span>{project.text}</span>
                <div className="stack-list">
                  {project.stack.map((item) => (
                    <small key={item}>{item}</small>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="section value-band">
        <div className="section-heading">
          <p className="section-kicker">Valeur</p>
          <h2>Une progression cohérente entre développement, projet et sécurité.</h2>
        </div>
        <div className="value-grid">
          {values.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section contact">
        <div>
          <p className="section-kicker">Contact</p>
          <h2>Disponible pour échanger pour des opportunités autour du développement.</h2>
        </div>
        <ContactLinks />
      </section>
    </main>
  );
}
