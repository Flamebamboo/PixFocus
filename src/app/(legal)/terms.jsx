import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TermsOfService = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Terms of Service</Text>
          <View style={styles.section}>
            <Text style={styles.text}>
              These terms and conditions apply to the PixFocus app (hereby referred to as "Application") for mobile
              devices that was created by Athmar Jefry (hereby referred to as "Service Provider") as an Ad Supported
              service.
            </Text>

            <Text style={styles.text}>
              Upon downloading or utilizing the Application, you are automatically agreeing to the following terms. It
              is strongly advised that you thoroughly read and understand these terms prior to using the Application.
              Unauthorized copying, modification of the Application, any part of the Application, or our trademarks is
              strictly prohibited. Any attempts to extract the source code of the Application, translate the Application
              into other languages, or create derivative versions are not permitted. All trademarks, copyrights,
              database rights, and other intellectual property rights related to the Application remain the property of
              the Service Provider.
            </Text>

            <Text style={styles.text}>
              The Service Provider is dedicated to ensuring that the Application is as beneficial and efficient as
              possible. As such, they reserve the right to modify the Application or charge for their services at any
              time and for any reason. The Service Provider assures you that any charges for the Application or its
              services will be clearly communicated to you.
            </Text>

            <Text style={styles.sectionTitle}>Data and Security</Text>
            <Text style={styles.text}>
              The Application stores and processes personal data that you have provided to the Service Provider in order
              to provide the Service. It is your responsibility to maintain the security of your phone and access to the
              Application. The Service Provider strongly advise against jailbreaking or rooting your phone, which
              involves removing software restrictions and limitations imposed by the official operating system of your
              device. Such actions could expose your phone to malware, viruses, malicious programs, compromise your
              phone's security features, and may result in the Application not functioning correctly or at all.
            </Text>

            <Text style={styles.sectionTitle}>Third-Party Services</Text>
            <Text style={styles.text}>
              The Application utilizes third-party services that have their own Terms and Conditions, including but not
              limited to: • AdMob • Expo • RevenueCat
            </Text>

            <Text style={styles.sectionTitle}>Internet and Network Usage</Text>
            <Text style={styles.text}>
              Some functions of the Application require an active internet connection, which can be Wi-Fi or provided by
              your mobile network provider. The Service Provider cannot be held responsible if the Application does not
              function at full capacity due to lack of access to Wi-Fi or if you have exhausted your data allowance.
            </Text>

            <Text style={styles.text}>
              If you are using the application outside of a Wi-Fi area, please be aware that your mobile network
              provider's agreement terms still apply. Consequently, you may incur charges from your mobile provider for
              data usage during the connection to the application, or other third-party charges.
            </Text>

            <Text style={styles.sectionTitle}>Liability and Responsibility</Text>
            <Text style={styles.text}>
              The Service Provider cannot always assume responsibility for your usage of the application. It is your
              responsibility to ensure that your device remains charged. If your device runs out of battery and you are
              unable to access the Service, the Service Provider cannot be held responsible.
            </Text>

            <Text style={styles.text}>
              The Service Provider accepts no liability for any loss, direct or indirect, that you experience as a
              result of relying entirely on this functionality of the application.
            </Text>

            <Text style={styles.sectionTitle}>Updates and Termination</Text>
            <Text style={styles.text}>
              The Service Provider may update the application at any time. You agree to always accept updates to the
              application when offered to you. The Service Provider may also wish to cease providing the application and
              may terminate its use at any time without providing termination notice to you. Upon any termination, (a)
              the rights and licenses granted to you in these terms will end; (b) you must cease using the application,
              and (if necessary) delete it from your device.
            </Text>

            <Text style={styles.sectionTitle}>Changes to Terms and Conditions</Text>
            <Text style={styles.text}>
              The Service Provider may periodically update these terms and conditions. Thus, you are advised to review
              this page periodically for any changes.
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

export default TermsOfService;
