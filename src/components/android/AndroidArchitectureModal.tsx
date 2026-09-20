import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { 
  Code2, 
  Copy, 
  Check, 
  X, 
  Layers, 
  Database, 
  Terminal, 
  Smartphone, 
  CheckCircle2,
  Share2
} from 'lucide-react';

interface AndroidArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidArchitectureModal: React.FC<AndroidArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const { settings } = useApp();
  const lang = settings.language;
  const labels = t[lang];

  const [activeCodeTab, setActiveCodeTab] = useState<'entity' | 'dao' | 'viewmodel' | 'compose' | 'gradle' | 'githubActions'>('githubActions');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const codeSnippets = {
    githubActions: `# .github/workflows/build-apk.yml
# GitHub Actions Automated APK Builder
name: Build Android APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:
    inputs:
      build_type:
        description: 'Build Type (debug or release)'
        required: true
        default: 'debug'

permissions:
  contents: write

jobs:
  build-apk:
    name: Build & Package Android APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies & build
        run: |
          npm install --legacy-peer-deps
          npm run build
          npx cap sync android

      - name: Set up Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'
          cache: 'gradle'

      - name: Grant execute permission
        run: chmod +x android/gradlew

      - name: Build Debug APK
        run: |
          cd android
          ./gradlew assembleDebug --stacktrace
          cd ..

      - name: Collect Output APK
        run: |
          mkdir -p build-output
          cp android/app/build/outputs/apk/debug/app-debug.apk build-output/fitprompt-ai-debug.apk

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: FitPrompt-AI-APK
          path: build-output/*.apk
          retention-days: 30`,
    entity: `// Room Database Entities in Kotlin
package com.fitprompt.android.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverters
import com.fitprompt.android.data.local.converters.Converters

@Entity(tableName = "workout_programs")
data class WorkoutProgramEntity(
    @PrimaryKey val id: String,
    val schemaVersion: String,
    val name: String,
    val description: String?,
    val durationWeeks: Int,
    val daysPerWeek: Int,
    val rawJsonContract: String,
    val createdAtTimestamp: Long = System.currentTimeMillis(),
    val isActive: Boolean = false
)

@Entity(tableName = "workout_sessions")
data class WorkoutSessionEntity(
    @PrimaryKey val id: String,
    val programId: String,
    val dayId: String,
    val dayName: String,
    val startTime: Long,
    val endTime: Long?,
    val durationSeconds: Long,
    val totalVolumeKg: Double,
    val totalSets: Int,
    val totalReps: Int,
    val rating: Int,
    val notes: String?
)

@Entity(tableName = "personal_records")
data class PersonalRecordEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val exerciseName: String,
    val metric: String, // "max_weight" or "max_reps"
    val value: Double,
    val unit: String,
    val dateLogged: Long,
    val sessionId: String
)`,

    dao: `// Room Database DAO Pattern
package com.fitprompt.android.data.local.dao

import androidx.room.*
import com.fitprompt.android.data.local.entities.*
import kotlinx.coroutines.flow.Flow

@Dao
interface WorkoutDao {
    @Query("SELECT * FROM workout_programs ORDER BY createdAtTimestamp DESC")
    fun getAllPrograms(): Flow<List<WorkoutProgramEntity>>

    @Query("SELECT * FROM workout_programs WHERE isActive = 1 LIMIT 1")
    fun getActiveProgram(): Flow<WorkoutProgramEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProgram(program: WorkoutProgramEntity)

    @Query("UPDATE workout_programs SET isActive = (id = :activeId)")
    suspend fun setActiveProgram(activeId: String)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSession(session: WorkoutSessionEntity)

    @Query("SELECT * FROM workout_sessions ORDER BY startTime DESC")
    fun getSessionHistory(): Flow<List<WorkoutSessionEntity>>

    @Insert
    suspend fun insertPR(pr: PersonalRecordEntity)

    @Query("SELECT * FROM personal_records WHERE exerciseName = :exerciseName ORDER BY value DESC LIMIT 1")
    suspend fun getBestPRForExercise(exerciseName: String): PersonalRecordEntity?
}`,

    viewmodel: `// Android Jetpack Compose ViewModel with StateFlow
package com.fitprompt.android.presentation.workout

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.fitprompt.android.domain.repository.WorkoutRepository
import com.fitprompt.android.domain.model.WorkoutSession
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class WorkoutTrackerViewModel @Inject constructor(
    private val repository: WorkoutRepository,
    private val soundController: SoundController
) : ViewModel() {

    private val _uiState = MutableStateFlow<WorkoutUiState>(WorkoutUiState.Idle)
    val uiState: StateFlow<WorkoutUiState> = _uiState.asStateFlow()

    fun completeSet(exerciseIndex: Int, setIndex: Int) {
        viewModelScope.launch {
            repository.updateSetCompletion(exerciseIndex, setIndex)
            soundController.playSetComplete()
            _uiState.update { current ->
                // Trigger Rest Timer
                current.copy(isRestTimerActive = true, restRemainingSeconds = 90)
            }
        }
    }

    fun finishSession(notes: String, rating: Int) {
        viewModelScope.launch {
            val session = repository.finalizeActiveSession(notes, rating)
            if (session.newPRsCount > 0) {
                soundController.playPRCelebration()
            }
            _uiState.value = WorkoutUiState.Completed(session)
        }
    }
}`,

    compose: `// Jetpack Compose Material 3 Workout Floor Screen
package com.fitprompt.android.presentation.workout

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun WorkoutScreen(
    viewModel: WorkoutTrackerViewModel,
    onFinishWorkout: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("FitPrompt • Workout Tracker") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            // Gym Floor Big Controls
            ExerciseList(
                exercises = state.exercises,
                onSetComplete = { exIdx, setIdx ->
                    viewModel.completeSet(exIdx, setIdx)
                }
            )
            
            // Rest Timer Bottom Bar
            if (state.isRestTimerActive) {
                FloatingRestTimer(
                    remainingSeconds = state.restRemainingSeconds,
                    onSkip = { viewModel.skipTimer() }
                )
            }
        }
    }
}`,

    gradle: `// build.gradle.kts (Module: app)
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.kapt)
    alias(libs.plugins.hilt.android)
}

dependencies {
    // Jetpack Compose BOM
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)

    // Room Database
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    kapt(libs.androidx.room.compiler)

    // Hilt Dependency Injection
    implementation(libs.hilt.android)
    kapt(libs.hilt.compiler)

    // WorkManager (Background Reminders)
    implementation(libs.androidx.work.runtime.ktx)

    // Kotlinx Serialization for AI JSON
    implementation(libs.kotlinx.serialization.json)
}`
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Android Jetpack Compose & Clean Architecture
              </h3>
              <span className="text-[11px] text-zinc-400">
                Senior Android Developer Blueprint (MVVM + Room + Hilt + StateFlow)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Code Tabs */}
        <div className="flex items-center gap-1.5 pt-3 pb-2 border-b border-zinc-800/80 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveCodeTab('githubActions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeCodeTab === 'githubActions' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>GitHub Actions (APK Build)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
          <button
            onClick={() => setActiveCodeTab('entity')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeCodeTab === 'entity' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Room Entities (Kotlin)
          </button>
          <button
            onClick={() => setActiveCodeTab('dao')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeCodeTab === 'dao' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Room DAO
          </button>
          <button
            onClick={() => setActiveCodeTab('viewmodel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeCodeTab === 'viewmodel' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Hilt ViewModel
          </button>
          <button
            onClick={() => setActiveCodeTab('compose')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeCodeTab === 'compose' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Compose Screen
          </button>
          <button
            onClick={() => setActiveCodeTab('gradle')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeCodeTab === 'gradle' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            build.gradle.kts
          </button>
        </div>

        {/* Code Content Container */}
        <div className="py-3 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span className="font-mono text-[11px]">Kotlin Clean Architecture</span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'کپی شد' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200 leading-relaxed overflow-x-auto select-text selection:bg-emerald-500/30">
            {codeSnippets[activeCodeTab]}
          </pre>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <span>Ready for Android Studio export & gradle sync</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold"
          >
            {labels.close}
          </button>
        </div>
      </div>
    </div>
  );
};
