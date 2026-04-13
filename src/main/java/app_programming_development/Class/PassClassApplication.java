package app_programming_development.Class;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PassClassApplication {
	public static void main(String[] args) {
		SpringApplication.run(PassClassApplication.class, args);
	}

}
