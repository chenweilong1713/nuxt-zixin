<template>
  <div class="github-repositories">
    <div class="header">
      <h2>项目</h2>
      <div class="controls">
<!--        <input -->
<!--          v-model="username" -->
<!--          type="text" -->
<!--          placeholder="输入GitHub用户名" -->
<!--          @keyup.enter="fetchRepositories"-->
<!--          class="username-input"-->
<!--        />-->
<!--        <button @click="fetchRepositories" :disabled="loading" class="fetch-btn">-->
<!--          {{ loading ? '加载中...' : '获取项目' }}-->
<!--        </button>-->
      </div>
    </div>

    <div v-if="loading" class="loading">
      正在加载项目...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="repositories && repositories.length > 0" class="repositories-list">
      <div 
        v-for="repo in repositories" 
        :key="repo.id" 
        class="repository-card"
        @click="openRepo(repo.url)"
      >
        <div class="repo-header">
          <h3 class="repo-name">
            <span class="repo-icon">📁</span>
            {{ repo.name }}
          </h3>
          <div class="repo-stats">
            <span class="language" v-if="repo.language">
              <span class="language-color" :style="{ backgroundColor: getLanguageColor(repo.language) }"></span>
              {{ repo.language }}
            </span>
            <span class="stars">
              <span class="star-icon">⭐</span>{{ repo.stars }}
            </span>
            <span class="forks">
              <span class="fork-icon">🔄</span>{{ repo.forks }}
            </span>
          </div>
        </div>
        
        <p class="repo-description" v-if="repo.description">
          {{ repo.description }}
        </p>
        
        <div class="repo-meta">
          <span v-if="repo.homepage" class="homepage">
            <a :href="repo.homepage" target="_blank" rel="noopener noreferrer" @click.stop>
              🌐 {{ repo.homepage }}
            </a>
          </span>
          <span class="updated-at">
            更新于: {{ formatDate(repo.updatedAt) }}
          </span>
        </div>
        
        <div class="repo-tags">
          <span class="private-tag" v-if="repo.private">🔒 私有</span>
          <span class="archived-tag" v-if="repo.archived">📦 已归档</span>
        </div>
      </div>
    </div>

    <div v-else-if="repositories" class="empty">
      暂无项目
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import GithubAPI from '@/api/githubAPI';

// 定义仓库数据类型
interface Repository {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  url: string;
  homepage?: string;
  private: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

// 响应式数据
const username = ref('chenweilong1713'); // 默认用户名
const repositories = ref<Repository[] | null>(null);
const loading = ref(false);
const error = ref('');

// 语言颜色映射
const languageColors: Record<string, string> = {
  'TypeScript': '#3178c6',
  'JavaScript': '#f1e05a',
  'Python': '#3572a5',
  'Java': '#b07219',
  'Go': '#00add8',
  'C++': '#f34b7d',
  'C': '#555555',
  'C#': '#178600',
  'PHP': '#4f5d95',
  'Ruby': '#701516',
  'Swift': '#ffac45',
  'Kotlin': '#f18e33',
  'Rust': '#dea584',
  'Scala': '#c22d40',
  'Shell': '#89e051',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Vue': '#41b883',
  'Svelte': '#ff3e00',
  'React': '#61dafb',
  'Angular': '#dd0031',
  'Dart': '#00b4ab',
  'Flutter': '#02569b'
};

// 获取仓库列表
const fetchRepositories = async () => {
  if (!username.value.trim()) {
    error.value = '请输入GitHub用户名';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const response: any = await GithubAPI.getRepositories(username.value);
    
    if (response.success) {
      repositories.value = response.data.repositories;
    } else {
      error.value = response.message || '获取项目列表失败';
    }
  } catch (err: any) {
    console.error('获取GitHub项目失败:', err);
    error.value = err.message || '获取项目列表时发生错误';
  } finally {
    loading.value = false;
  }
};

// 获取语言颜色
const getLanguageColor = (language: string): string => {
  return languageColors[language] || '#888888';
};

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 打开仓库链接
const openRepo = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

// 组件挂载时自动获取默认用户的仓库
onMounted(() => {
  fetchRepositories();
});
</script>

<style scoped>
.github-repositories {
  padding: 20px;
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  min-height: 400px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5em;
}

.controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.username-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  min-width: 200px;
}

.fetch-btn {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.fetch-btn:hover:not(:disabled) {
  background: #66b1ff;
}

.fetch-btn:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #f56c6c;
}

.repositories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
}

.repository-card {
  background: rgba(255, 255, 255, 0.35);
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border: 1px solid #eee;
}

.repository-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.repo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.repo-name {
  margin: 0;
  font-size: 1.2em;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.repo-icon {
  font-size: 1.2em;
}

.repo-stats {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-shrink: 0;
}

.language {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9em;
  color: #666;
}

.language-color {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  vertical-align: middle;
}

.stars, .forks {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9em;
  color: #666;
}

.repo-description {
  margin: 10px 0;
  color: #555;
  line-height: 1.5;
  font-size: 0.95em;
}

.repo-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85em;
  color: #888;
  margin-top: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.homepage a {
  color: #409eff;
  text-decoration: none;
}

.homepage a:hover {
  text-decoration: underline;
}

.updated-at {
  white-space: nowrap;
}

.repo-tags {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.private-tag, .archived-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  color: white;
}

.private-tag {
  background: #e6a23c;
}

.archived-tag {
  background: #909399;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .repositories-list {
    grid-template-columns: 1fr;
  }
  
  .repo-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .repo-stats {
    align-self: stretch;
  }
  
  .repo-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .username-input {
    min-width: auto;
  }
}
</style>