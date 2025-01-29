import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicy = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Privacy Policy</Text>
          <View style={styles.section}>
            <Text style={styles.text}>
              This privacy policy applies to the PixFocus app (hereby referred to as "Application") for mobile devices
              that was created by Athmar Jefry (hereby referred to as "Service Provider") as an Ad Supported service.
              This service is intended for use "AS IS".
            </Text>

            <Text style={styles.sectionTitle}>Information Collection and Use</Text>
            <Text style={styles.text}>
              The Application collects information when you download and use it. This information may include
              information such as:
            </Text>
            <Text style={styles.text}>
              • Your device's Internet Protocol address (e.g. IP address)
              {'\n'}• Your device's timezone information for accurate time tracking
              {'\n'}• Focus session data including duration, completion status, and task name
              {'\n'}• The pages of the Application that you visit, the time and date of your visit
              {'\n'}• The time spent on the Application and specific focus sessions
              {'\n'}• The operating system you use on your mobile device
            </Text>
            <Text style={styles.text}>
              The Application does not gather precise information about the location of your mobile device. Focus
              session data is collected to provide you with statistics, track your progress, and improve the
              Application's functionality.
            </Text>

            <Text style={styles.text}>
              The Service Provider may use the information you provided to contact you from time to time to provide you
              with important information, required notices and marketing promotions.
            </Text>

            <Text style={styles.text}>
              For a better experience, while using the Application, the Service Provider may require you to provide us
              with certain personally identifiable information, including but not limited to Email, username, The
              information that the Service Provider request will be retained by them and used as described in this
              privacy policy.
            </Text>

            <Text style={styles.sectionTitle}>Third Party Access</Text>
            <Text style={styles.text}>
              Only aggregated, anonymized data is periodically transmitted to external services to aid the Service
              Provider in improving the Application and their service. The Service Provider may share your information
              with third parties in the ways that are described in this privacy statement.
            </Text>

            <Text style={styles.text}>
              The Application utilizes third-party services that have their own Privacy Policy about handling data.
              These third-party service providers include:
              {'\n'}• AdMob
              {'\n'}• Expo
              {'\n'}• RevenueCat
            </Text>

            <Text style={styles.sectionTitle}>Data Disclosure</Text>
            <Text style={styles.text}>
              The Service Provider may disclose User Provided and Automatically Collected Information:
              {'\n'}• As required by law, such as to comply with a subpoena, or similar legal process
              {'\n'}• When they believe in good faith that disclosure is necessary to protect their rights, protect your
              safety or the safety of others, investigate fraud, or respond to a government request
              {'\n'}• With their trusted services providers who work on their behalf, do not have an independent use of
              the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy
              statement
            </Text>

            <Text style={styles.sectionTitle}>Opt-Out Rights</Text>
            <Text style={styles.text}>
              You can stop all collection of information by the Application easily by uninstalling it. You may use the
              standard uninstall processes as may be available as part of your mobile device or via the mobile
              application marketplace or network.
            </Text>

            <Text style={styles.sectionTitle}>Data Retention Policy</Text>
            <Text style={styles.text}>
              The Service Provider will retain User Provided data for as long as you use the Application and for a
              reasonable time thereafter. If you'd like them to delete User Provided Data that you have provided via the
              Application, please contact them at addrifto@gmai.com and they will respond in a reasonable time.
            </Text>

            <Text style={styles.sectionTitle}>Children</Text>
            <Text style={styles.text}>
              The Service Provider does not use the Application to knowingly solicit data from or market to children
              under the age of 13. The Application does not address anyone under the age of 13. The Service Provider
              does not knowingly collect personally identifiable information from children under 13 years of age. In the
              case the Service Provider discover that a child under 13 has provided personal information, the Service
              Provider will immediately delete this from their servers. If you are a parent or guardian and you are
              aware that your child has provided us with personal information, please contact the Service Provider
              (addrifto@gmai.com) so that they will be able to take the necessary actions.
            </Text>

            <Text style={styles.sectionTitle}>Security</Text>
            <Text style={styles.text}>
              The Service Provider is concerned about safeguarding the confidentiality of your information. The Service
              Provider provides physical, electronic, and procedural safeguards to protect information the Service
              Provider processes and maintains.
            </Text>

            <Text style={styles.sectionTitle}>Changes to Privacy Policy</Text>
            <Text style={styles.text}>
              This Privacy Policy may be updated from time to time. Any changes will be notified to you by posting the
              new Privacy Policy on this page.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 20,
    color: '#444',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 15,
  },
});

export default PrivacyPolicy;
