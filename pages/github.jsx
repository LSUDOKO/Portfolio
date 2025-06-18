import React, { useEffect, useState } from 'react';
import GitHubCalendar from 'react-github-calendar';
import styles from '../styles/GithubPage.module.css';

const GithubPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animateCount, setAnimateCount] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [repoCount, setRepoCount] = useState(0);
  const [contributionCount, setContributionCount] = useState(0);
  
  const username = 'LSUDOKO'; // Set the GitHub username here

  // Define the calendar theme - using blue color scheme
  const theme = {
    level0: '#161B22',
    level1: '#0D419D',
    level2: '#1158DB',
    level3: '#2E7BEE',
    level4: '#4A9FFF',
  };

  // Function to handle the redirect to GitHub profile
  const handleRedirectToGitHub = () => {
    window.open(`https://github.com/${username}`, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
    
    // Fetch user data from GitHub
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const userData = await response.json();
        
        if (userData) {
          setFollowerCount(userData.followers || 0);
          setRepoCount(userData.public_repos || 0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Fallback values
        setFollowerCount(0);
        setRepoCount(0);
      }
    };
    
    // Fetch repositories from GitHub
    const fetchRepos = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const data = await response.json();
        
        // Filter and sort repositories
        if (Array.isArray(data)) {
          setRepos(data);
          
          // Select featured repos (non-forked, with stars or recently updated)
          const featured = data
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 4);
            
          setSelectedRepos(featured);
        }
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    };
    
    // Fetch contribution count (approximate using events API)
    const fetchContributions = async () => {
      try {
        // We can use the events API to roughly estimate recent contributions
        const response = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`);
        const events = await response.json();
        
        if (Array.isArray(events)) {
          // Filter recent events (last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          // Count different contribution types
          const recentEvents = events.filter(event => {
            const eventDate = new Date(event.created_at);
            return eventDate > thirtyDaysAgo;
          });
          
          setContributionCount(recentEvents.length);
        }
      } catch (error) {
        console.error('Error fetching contributions:', error);
        setContributionCount(0);
      }
    };
    
    fetchUserData();
    fetchRepos();
    fetchContributions();
    
    // Delay the counter animation
    setTimeout(() => {
      setAnimateCount(true);
    }, 500);
  }, [username]);

  return (
    <div className={`${styles.mainContainer} ${isLoaded ? styles.loaded : ''}`}>
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>
          <img 
            src={`https://github.com/${username}.png`} 
            alt="GitHub Avatar" 
            className={styles.avatarImage}
          />
        </div>
        <h1 className={styles.profileName}>{username}</h1>
        <p className={styles.profileBio}>Developer and Open Source Enthusiast</p>
        
        <div className={styles.statsBox}>
          <div className={styles.statsItem}>
            <span className={styles.statNumber}>
              {animateCount ? (
                <CountUp end={followerCount} duration={2} />
              ) : "0"}
            </span>
            <span className={styles.statLabel}>followers</span>
          </div>
          <div className={styles.statsItem}>
            <span className={styles.statNumber}>
              {animateCount ? (
                <CountUp end={repoCount} duration={2} />
              ) : "0"}
            </span>
            <span className={styles.statLabel}>repos</span>
          </div>
          <div className={styles.statsItem}>
            <span className={styles.statNumber}>
              {animateCount ? (
                <CountUp end={contributionCount} duration={2} />
              ) : "0"}
            </span>
            <span className={styles.statLabel}>contributions</span>
          </div>
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <button 
          className={styles.button} 
          onClick={handleRedirectToGitHub}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={styles.btnIcon}>
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Open GitHub Profile
        </button>
      </div>

      <div className={styles.contributionsContainer}>
        <h2 className={styles.sectionTitle}>
          <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" className={styles.titleIcon}>
            <path fillRule="evenodd" d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z" />
          </svg>
          Contribution Activity
        </h2>
        <div className={styles.calendarWrapper}>
          <GitHubCalendar
            username={username}
            theme={theme}
            hideColorLegend
            className={styles.calendar}
          />
        </div>
      </div>
      
      <div className={styles.featuredReposSection}>
        <h2 className={styles.sectionTitle}>
          <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" className={styles.titleIcon}>
            <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
          </svg>
          Featured Repositories
        </h2>
        
        <div className={styles.reposGrid}>
          {selectedRepos.length > 0 ? (
            selectedRepos.map(repo => (
              <a 
                key={repo.id}
                href={repo.html_url}
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.repoCard}
              >
                <h3 className={styles.repoName}>{repo.name}</h3>
                <p className={styles.repoDescription}>
                  {repo.description || 'No description provided.'}
                </p>
                <div className={styles.repoFooter}>
                  {repo.language && (
                    <span className={styles.repoLanguage}>
                      <span 
                        className={styles.languageDot} 
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      ></span>
                      {repo.language}
                    </span>
                  )}
                  {repo.stargazers_count > 0 && (
                    <span className={styles.repoStat}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                      </svg>
                      {repo.stargazers_count}
                    </span>
                  )}
                  {repo.forks_count > 0 && (
                    <span className={styles.repoStat}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                      </svg>
                      {repo.forks_count}
                    </span>
                  )}
                </div>
              </a>
            ))
          ) : (
            <div className={styles.noRepos}>
              <p>Loading repositories...</p>
            </div>
          )}
        </div>
      </div>

      {/* <div className={styles.githubSkills}>
        <h2 className={styles.sectionTitle}>
          <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" className={styles.titleIcon}>
            <path fillRule="evenodd" d="M1.5 2.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V2.75zM1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25V2.75A1.75 1.75 0 0014.25 1H1.75zm7.25 9.75a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H9zm-5.5-5a.5.5 0 000 1h7a.5.5 0 000-1h-7zm0 3a.5.5 0 000 1h7a.5.5 0 000-1h-7z" />
          </svg>
          Technical Skills
        </h2>
        <div className={styles.skillsGrid}>
          <div className={styles.skillCard}>
            <h3>Languages</h3>
            <div className={styles.skillTags}>
              <span className={styles.skillTag}>JavaScript</span>
              <span className={styles.skillTag}>TypeScript</span>
              <span className={styles.skillTag}>HTML/CSS</span>
              <span className={styles.skillTag}>Golang</span>
              <span className={styles.skillTag}>Python</span>
            </div>
          </div>
          
          <div className={styles.skillCard}>
            <h3>Frameworks</h3>
            <div className={styles.skillTags}>
              <span className={styles.skillTag}>React</span>
              <span className={styles.skillTag}>Next.js</span>
              <span className={styles.skillTag}>Express</span>
              <span className={styles.skillTag}>Node.js</span>
              <span className={styles.skillTag}>React Native</span>
            </div>
          </div>
          
          <div className={styles.skillCard}>
            <h3>Tools</h3>
            <div className={styles.skillTags}>
              <span className={styles.skillTag}>Git</span>
              <span className={styles.skillTag}>Docker</span>
              <span className={styles.skillTag}>AWS</span>
              <span className={styles.skillTag}>Firebase</span>
              <span className={styles.skillTag}>MongoDB</span>
            </div>
          </div>
        </div>
      </div> */}

      <div className={styles.footer}>
        <a href={`https://github.com/${username}?tab=repositories`} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
          View All Repositories
        </a>
      </div>
    </div>
  );
};

// Simple CountUp component for animating numbers
const CountUp = ({ end, duration, suffix = '' }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60);
    
    const timer = setInterval(() => {
      start += increment;
      setCount(Math.floor(start));
      
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, 16.67); // ~60fps
    
    return () => clearInterval(timer);
  }, [end, duration]);
  
  return <>{count}{suffix}</>;
};

// Helper function to get language color
const getLanguageColor = (language) => {
  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Python: "#3572A5",
    "C++": "#f34b7d",
    Java: "#b07219",
    Go: "#00ADD8",
    Rust: "#dea584",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Swift: "#ffac45",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    Shell: "#89e051",
    Other: "#c9c9c9"
  };
  
  return colors[language] || colors["Other"];
};

export default GithubPage;
