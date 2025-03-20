import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Switch } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Bell, Calendar, CircleCheck as CheckCircle2, CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

type Reminder = {
  enabled: boolean;
  time: string;
  days: string[];
};

export default function HabitDetails() {
  const { id } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [habitName, setHabitName] = useState('Morning Meditation');
  const [reminder, setReminder] = useState<Reminder>({
    enabled: true,
    time: '08:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  });

  const streak = 7;
  const progress = 0.8;
  const completionRate = 85;

  const handleSave = () => {
    setIsEditing(false);
    // Save changes
  };

  const handleDelete = () => {
    router.back();
    // Delete habit
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setIsEditing(true)}
        >
          <Edit2 size={20} color="#6366F1" />
        </Pressable>
      </Animated.View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          {isEditing ? (
            <TextInput
              style={styles.titleInput}
              value={habitName}
              onChangeText={setHabitName}
              onBlur={handleSave}
              autoFocus
            />
          ) : (
            <Text style={styles.title}>{habitName}</Text>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completionRate}%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
          <View style={styles.statCard}>
            <CheckCircle2 size={24} color={progress >= 1 ? '#10B981' : '#6B7280'} />
            <Text style={styles.statLabel}>Today</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.scheduleCard}>
            <Calendar size={20} color="#6366F1" />
            <Text style={styles.scheduleText}>Every day</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          <View style={styles.reminderCard}>
            <View style={styles.reminderHeader}>
              <View style={styles.reminderInfo}>
                <Bell size={20} color="#6366F1" />
                <Text style={styles.reminderTime}>{reminder.time}</Text>
              </View>
              <Switch
                value={reminder.enabled}
                onValueChange={(value) => 
                  setReminder(prev => ({ ...prev, enabled: value }))
                }
                trackColor={{ false: '#E5E7EB', true: '#818CF8' }}
                thumbColor={reminder.enabled ? '#6366F1' : '#fff'}
              />
            </View>
            <View style={styles.daysList}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Pressable
                  key={day}
                  style={[
                    styles.dayChip,
                    reminder.days.includes(day) && styles.dayChipSelected,
                  ]}
                  onPress={() => {
                    setReminder(prev => ({
                      ...prev,
                      days: prev.days.includes(day)
                        ? prev.days.filter(d => d !== day)
                        : [...prev.days, day],
                    }));
                  }}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      reminder.days.includes(day) && styles.dayChipTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deleteButtonPressed,
          ]}
          onPress={handleDelete}
        >
          <Trash2 size={20} color="#EF4444" />
          <Text style={styles.deleteButtonText}>Delete Habit</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-700',
    color: '#1F2937',
  },
  titleInput: {
    fontSize: 28,
    fontFamily: 'Poppins-700',
    color: '#1F2937',
    padding: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    minWidth: 100,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-500',
    color: '#6B7280',
  },
  section: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-600',
    color: '#1F2937',
    marginBottom: 16,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  scheduleText: {
    fontSize: 16,
    fontFamily: 'Poppins-500',
    color: '#4B5563',
  },
  reminderCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reminderTime: {
    fontSize: 16,
    fontFamily: 'Poppins-500',
    color: '#4B5563',
  },
  daysList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayChipSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  dayChipText: {
    fontSize: 14,
    fontFamily: 'Poppins-500',
    color: '#6B7280',
  },
  dayChipTextSelected: {
    color: '#6366F1',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 48,
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
  },
  deleteButtonPressed: {
    opacity: 0.8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-500',
    color: '#EF4444',
  },
});